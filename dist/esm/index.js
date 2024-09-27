import Blockchains from '@depay/web3-blockchains';
import { BN, struct, u64, i64, u128, bool, Connection, ACCOUNT_LAYOUT, PublicKey, Keypair, SystemProgram, Buffer, TransactionInstruction, publicKey } from '@depay/solana-web3.js';
import { ethers } from 'ethers';
import Token from '@depay/web3-tokens';
import { dripAssets } from '@depay/web3-assets';
import Exchanges from '@depay/web3-exchanges';

var solanaRouters = {
  solana: {
    address: 'DePayRG7ZySPWzeK9Kvq7aPeif7sdbBZNh6DHcvNj7F7',
    ammProgram: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
    alt: 'EYGgx5fYCZtLN2pvnR4Bhn5KpMffKwyHCms4VhjSvF2K',
    api: {
      createPaymentsAccount: {
        anchorDiscriminator: new BN("8445995362644372894"),
        layout: struct([
          u64("anchorDiscriminator"),
        ])
      },
      createEscrowSolAccount: {
        anchorDiscriminator: new BN("2482112285991870004"),
        layout: struct([
          u64("anchorDiscriminator"),
        ])
      },
      createEscrowTokenAccount: {
        anchorDiscriminator: new BN("16156440424245087"),
        layout: struct([
          u64("anchorDiscriminator"),
        ])
      },
      routeSol: {
        anchorDiscriminator: new BN("6497164560834983274"),
        layout: struct([
          u64("anchorDiscriminator"),
          u64("nonce"),
          u64("paymentAmount"),
          u64("feeAmount"),
          i64("deadline"),
        ])
      },
      routeToken: {
        anchorDiscriminator: new BN("13483873682232752277"),
        layout: struct([
          u64("anchorDiscriminator"),
          u64("nonce"),
          u64("paymentAmount"),
          u64("feeAmount"),
          i64("deadline"),
        ])
      },
      routeOrcaSwap: {
        anchorDiscriminator: new BN("9797248061404332986"),
        layout: struct([
          u64("anchorDiscriminator"),
          u64("nonce"),
          u64("amountIn"),
          u128("sqrtPriceLimit"),
          bool("amountSpecifiedIsInput"),
          bool("aToB"),
          u64("paymentAmount"),
          u64("feeAmount"),
          i64("deadline"),
        ])
      },
      routeOrcaSwapSolOut: {
        anchorDiscriminator: new BN("13662217913752830165"),
        layout: struct([
          u64("anchorDiscriminator"),
          u64("nonce"),
          u64("amountIn"),
          u128("sqrtPriceLimit"),
          bool("amountSpecifiedIsInput"),
          bool("aToB"),
          u64("paymentAmount"),
          u64("feeAmount"),
          i64("deadline"),
        ])
      },
      routeOrcaTwoHopSwap: {
        anchorDiscriminator: new BN("15695720599845325801"),
        layout: struct([
          u64("anchorDiscriminator"),
          u64("nonce"),
          u64("amountIn"),
          bool("amountSpecifiedIsInput"),
          bool("aToBOne"),
          bool("aToBTwo"),
          u128("sqrtPriceLimitOne"),
          u128("sqrtPriceLimitTwo"),
          u64("paymentAmount"),
          u64("feeAmount"),
          i64("deadline"),
        ])
      },
      routeOrcaTwoHopSwapSolOut: {
        anchorDiscriminator: new BN("15074061855608091530"),
        layout: struct([
          u64("anchorDiscriminator"),
          u64("nonce"),
          u64("amountIn"),
          bool("amountSpecifiedIsInput"),
          bool("aToBOne"),
          bool("aToBTwo"),
          u128("sqrtPriceLimitOne"),
          u128("sqrtPriceLimitTwo"),
          u64("paymentAmount"),
          u64("feeAmount"),
          i64("deadline"),
        ])
      }
    }
  },
};

let _window;

let getWindow = () => {
  if(_window) { return _window }
  if (typeof global == 'object') {
    _window = global;
  } else {
    _window = window;
  }
  return _window
};

const getConfiguration = () =>{
  if(getWindow()._Web3ClientConfiguration === undefined) {
    getWindow()._Web3ClientConfiguration = {};
  }
  return getWindow()._Web3ClientConfiguration
};

function _optionalChain$5(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
const BATCH_INTERVAL$1 = 10;
const CHUNK_SIZE$1 = 99;
const MAX_RETRY$1 = 5;

class StaticJsonRpcBatchProvider extends ethers.providers.JsonRpcProvider {

  constructor(url, network, endpoints, failover) {
    super(url);
    this._network = network;
    this._endpoint = url;
    this._endpoints = endpoints;
    this._failover = failover;
    this._pendingBatch = [];
  }

  detectNetwork() {
    return Promise.resolve(Blockchains.findByName(this._network).id)
  }

  requestChunk(chunk, endpoint, attempt) {

    try {

      const request = chunk.map((inflight) => inflight.request);
      return ethers.utils.fetchJson(endpoint, JSON.stringify(request))
        .then((result) => {
          // For each result, feed it to the correct Promise, depending
          // on whether it was a success or error
          chunk.forEach((inflightRequest, index) => {
            const payload = result[index];
            if (_optionalChain$5([payload, 'optionalAccess', _ => _.error])) {
              const error = new Error(payload.error.message);
              error.code = payload.error.code;
              error.data = payload.error.data;
              inflightRequest.reject(error);
            } else if(_optionalChain$5([payload, 'optionalAccess', _2 => _2.result])) {
              inflightRequest.resolve(payload.result);
            } else {
              inflightRequest.reject();
            }
          });
        }).catch((error) => {
          if(attempt < MAX_RETRY$1 && error && error.code == 'SERVER_ERROR') {
            const index = this._endpoints.indexOf(this._endpoint)+1;
            this._failover();
            this._endpoint = index >= this._endpoints.length ? this._endpoints[0] : this._endpoints[index];
            this.requestChunk(chunk, this._endpoint, attempt+1);
          } else {
            chunk.forEach((inflightRequest) => {
              inflightRequest.reject(error);
            });
          }
        })

    } catch (e) {

      chunk.forEach((inflightRequest) => {
        inflightRequest.reject();
      });
    }
  }
    
  send(method, params) {

    const request = {
      method: method,
      params: params,
      id: (this._nextId++),
      jsonrpc: "2.0"
    };

    if (this._pendingBatch == null) {
      this._pendingBatch = [];
    }

    const inflightRequest = { request, resolve: null, reject: null };

    const promise = new Promise((resolve, reject) => {
      inflightRequest.resolve = resolve;
      inflightRequest.reject = reject;
    });

    this._pendingBatch.push(inflightRequest);

    if (!this._pendingBatchAggregator) {
      // Schedule batch for next event loop + short duration
      this._pendingBatchAggregator = setTimeout(() => {
        // Get the current batch and clear it, so new requests
        // go into the next batch
        const batch = this._pendingBatch;
        this._pendingBatch = [];
        this._pendingBatchAggregator = null;
        // Prepare Chunks of CHUNK_SIZE
        const chunks = [];
        for (let i = 0; i < Math.ceil(batch.length / CHUNK_SIZE$1); i++) {
          chunks[i] = batch.slice(i*CHUNK_SIZE$1, (i+1)*CHUNK_SIZE$1);
        }
        chunks.forEach((chunk)=>{
          // Get the request as an array of requests
          chunk.map((inflight) => inflight.request);
          return this.requestChunk(chunk, this._endpoint, 1)
        });
      }, getConfiguration().batchInterval || BATCH_INTERVAL$1);
    }

    return promise
  }

}

function _optionalChain$4(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
const getAllProviders$1 = ()=> {
  if(getWindow()._Web3ClientProviders == undefined) {
    getWindow()._Web3ClientProviders = {};
  }
  return getWindow()._Web3ClientProviders
};

const setProvider$2 = (blockchain, provider)=> {
  if(getAllProviders$1()[blockchain] === undefined) { getAllProviders$1()[blockchain] = []; }
  const index = getAllProviders$1()[blockchain].indexOf(provider);
  if(index > -1) {
    getAllProviders$1()[blockchain].splice(index, 1);
  }
  getAllProviders$1()[blockchain].unshift(provider);
};

const setProviderEndpoints$2 = async (blockchain, endpoints, detectFastest = true)=> {
  
  getAllProviders$1()[blockchain] = endpoints.map((endpoint, index)=>
    new StaticJsonRpcBatchProvider(endpoint, blockchain, endpoints, ()=>{
      if(getAllProviders$1()[blockchain].length === 1) {
        setProviderEndpoints$2(blockchain, endpoints, detectFastest);
      } else {
        getAllProviders$1()[blockchain].splice(index, 1);
      }
    })
  );
  
  let provider;
  let window = getWindow();

  if(
    window.fetch == undefined ||
    (typeof process != 'undefined' && process['env'] && process['env']['NODE_ENV'] == 'test') ||
    (typeof window.cy != 'undefined') ||
    detectFastest === false
  ) {
    provider = getAllProviders$1()[blockchain][0];
  } else {
    
    let responseTimes = await Promise.all(endpoints.map((endpoint)=>{
      return new Promise(async (resolve)=>{
        let timeout = 900;
        let before = new Date().getTime();
        setTimeout(()=>resolve(timeout), timeout);
        let response;
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            referrer: "",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ method: 'net_version', id: 1, jsonrpc: '2.0' })
          });
        } catch (e) {}
        if(!_optionalChain$4([response, 'optionalAccess', _ => _.ok])) { return resolve(999) }
        let after = new Date().getTime();
        resolve(after-before);
      })
    }));

    const fastestResponse = Math.min(...responseTimes);
    const fastestIndex = responseTimes.indexOf(fastestResponse);
    provider = getAllProviders$1()[blockchain][fastestIndex];
  }
  
  setProvider$2(blockchain, provider);
};

const getProvider$2 = async (blockchain)=> {

  let providers = getAllProviders$1();
  if(providers && providers[blockchain]){ return providers[blockchain][0] }
  
  let window = getWindow();
  if(window._Web3ClientGetProviderPromise && window._Web3ClientGetProviderPromise[blockchain]) { return await window._Web3ClientGetProviderPromise[blockchain] }

  if(!window._Web3ClientGetProviderPromise){ window._Web3ClientGetProviderPromise = {}; }
  window._Web3ClientGetProviderPromise[blockchain] = new Promise(async(resolve)=> {
    await setProviderEndpoints$2(blockchain, Blockchains[blockchain].endpoints);
    resolve(getWindow()._Web3ClientProviders[blockchain][0]);
  });

  return await window._Web3ClientGetProviderPromise[blockchain]
};

const getProviders$2 = async(blockchain)=>{

  let providers = getAllProviders$1();
  if(providers && providers[blockchain]){ return providers[blockchain] }
  
  let window = getWindow();
  if(window._Web3ClientGetProvidersPromise && window._Web3ClientGetProvidersPromise[blockchain]) { return await window._Web3ClientGetProvidersPromise[blockchain] }

  if(!window._Web3ClientGetProvidersPromise){ window._Web3ClientGetProvidersPromise = {}; }
  window._Web3ClientGetProvidersPromise[blockchain] = new Promise(async(resolve)=> {
    await setProviderEndpoints$2(blockchain, Blockchains[blockchain].endpoints);
    resolve(getWindow()._Web3ClientProviders[blockchain]);
  });

  return await window._Web3ClientGetProvidersPromise[blockchain]
};

var EVM = {
  getProvider: getProvider$2,
  getProviders: getProviders$2,
  setProviderEndpoints: setProviderEndpoints$2,
  setProvider: setProvider$2,
};

function _optionalChain$3(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
const BATCH_INTERVAL = 10;
const CHUNK_SIZE = 99;
const MAX_RETRY = 10;

class StaticJsonRpcSequentialProvider extends Connection {

  constructor(url, network, endpoints, failover) {
    super(url);
    this._provider = new Connection(url);
    this._network = network;
    this._endpoint = url;
    this._endpoints = endpoints;
    this._failover = failover;
    this._pendingBatch = [];
    this._rpcRequest = this._rpcRequestReplacement.bind(this);
  }

  handleError(error, attempt, chunk) {
    if(attempt < MAX_RETRY) {
      const index = this._endpoints.indexOf(this._endpoint)+1;
      this._endpoint = index >= this._endpoints.length ? this._endpoints[0] : this._endpoints[index];
      this._provider = new Connection(this._endpoint);
      this.requestChunk(chunk, attempt+1);
    } else {
      chunk.forEach((inflightRequest) => {
        inflightRequest.reject(error);
      });
    }
  }

  batchRequest(requests, attempt) {
    return new Promise((resolve, reject) => {
      if (requests.length === 0) resolve([]); // Do nothing if requests is empty

      const batch = requests.map(params => {
        return this._rpcClient.request(params.methodName, params.args)
      });

      fetch(
        this._endpoint,
        {
          method: 'POST',
          body: JSON.stringify(batch),
          headers: { 'Content-Type': 'application/json' },
        }
      ).then((response)=>{
        if(response.ok) {
          response.json().then((parsedJson)=>{
            if(parsedJson.find((entry)=>_optionalChain$3([entry, 'optionalAccess', _ => _.error]))) {
              if(attempt < MAX_RETRY) {
                reject('Error in batch found!');
              } else {
                resolve(parsedJson);
              }
            } else {
              resolve(parsedJson);
            }
          }).catch(reject);
        } else {
          reject(`${response.status} ${response.text}`);
        }
      }).catch(reject);
    })
  }

  requestChunk(chunk, attempt) {

    const batch = chunk.map((inflight) => inflight.request);

    try {
      return this.batchRequest(batch, attempt)
        .then((result) => {
          chunk.forEach((inflightRequest, index) => {
            const payload = result[index];
            if (_optionalChain$3([payload, 'optionalAccess', _2 => _2.error])) {
              const error = new Error(payload.error.message);
              error.code = payload.error.code;
              error.data = payload.error.data;
              inflightRequest.reject(error);
            } else if(payload) {
              inflightRequest.resolve(payload);
            } else {
              inflightRequest.reject();
            }
          });
        }).catch((error)=>this.handleError(error, attempt, chunk))
    } catch (error){ return this.handleError(error, attempt, chunk) }
  }
    
  _rpcRequestReplacement(methodName, args) {

    const request = { methodName, args };

    if (this._pendingBatch == null) {
      this._pendingBatch = [];
    }

    const inflightRequest = { request, resolve: null, reject: null };

    const promise = new Promise((resolve, reject) => {
      inflightRequest.resolve = resolve;
      inflightRequest.reject = reject;
    });

    this._pendingBatch.push(inflightRequest);

    if (!this._pendingBatchAggregator) {
      // Schedule batch for next event loop + short duration
      this._pendingBatchAggregator = setTimeout(() => {
        // Get the current batch and clear it, so new requests
        // go into the next batch
        const batch = this._pendingBatch;
        this._pendingBatch = [];
        this._pendingBatchAggregator = null;
        // Prepare Chunks of CHUNK_SIZE
        const chunks = [];
        for (let i = 0; i < Math.ceil(batch.length / CHUNK_SIZE); i++) {
          chunks[i] = batch.slice(i*CHUNK_SIZE, (i+1)*CHUNK_SIZE);
        }
        chunks.forEach((chunk)=>{
          // Get the request as an array of requests
          chunk.map((inflight) => inflight.request);
          return this.requestChunk(chunk, 1)
        });
      }, getConfiguration().batchInterval || BATCH_INTERVAL);
    }

    return promise
  }
}

function _optionalChain$2(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
const getAllProviders = ()=> {
  if(getWindow()._Web3ClientProviders == undefined) {
    getWindow()._Web3ClientProviders = {};
  }
  return getWindow()._Web3ClientProviders
};

const setProvider$1 = (blockchain, provider)=> {
  if(getAllProviders()[blockchain] === undefined) { getAllProviders()[blockchain] = []; }
  const index = getAllProviders()[blockchain].indexOf(provider);
  if(index > -1) {
    getAllProviders()[blockchain].splice(index, 1);
  }
  getAllProviders()[blockchain].unshift(provider);
};

const setProviderEndpoints$1 = async (blockchain, endpoints, detectFastest = true)=> {
  
  getAllProviders()[blockchain] = endpoints.map((endpoint, index)=>
    new StaticJsonRpcSequentialProvider(endpoint, blockchain, endpoints, ()=>{
      if(getAllProviders()[blockchain].length === 1) {
        setProviderEndpoints$1(blockchain, endpoints, detectFastest);
      } else {
        getAllProviders()[blockchain].splice(index, 1);
      }
    })
  );

  let provider;
  let window = getWindow();

  if(
    window.fetch == undefined ||
    (typeof process != 'undefined' && process['env'] && process['env']['NODE_ENV'] == 'test') ||
    (typeof window.cy != 'undefined') ||
    detectFastest === false
  ) {
    provider = getAllProviders()[blockchain][0];
  } else {
    
    let responseTimes = await Promise.all(endpoints.map((endpoint)=>{
      return new Promise(async (resolve)=>{
        let timeout = 900;
        let before = new Date().getTime();
        setTimeout(()=>resolve(timeout), timeout);
        let response;
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            referrer: "",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ method: 'getIdentity', id: 1, jsonrpc: '2.0' })
          });
        } catch (e) {}
        if(!_optionalChain$2([response, 'optionalAccess', _ => _.ok])) { return resolve(999) }
        let after = new Date().getTime();
        resolve(after-before);
      })
    }));

    const fastestResponse = Math.min(...responseTimes);
    const fastestIndex = responseTimes.indexOf(fastestResponse);
    provider = getAllProviders()[blockchain][fastestIndex];
  }
  
  setProvider$1(blockchain, provider);
};

const getProvider$1 = async (blockchain)=> {

  let providers = getAllProviders();
  if(providers && providers[blockchain]){ return providers[blockchain][0] }
  
  let window = getWindow();
  if(window._Web3ClientGetProviderPromise && window._Web3ClientGetProviderPromise[blockchain]) { return await window._Web3ClientGetProviderPromise[blockchain] }

  if(!window._Web3ClientGetProviderPromise){ window._Web3ClientGetProviderPromise = {}; }
  window._Web3ClientGetProviderPromise[blockchain] = new Promise(async(resolve)=> {
    await setProviderEndpoints$1(blockchain, Blockchains[blockchain].endpoints);
    resolve(getWindow()._Web3ClientProviders[blockchain][0]);
  });

  return await window._Web3ClientGetProviderPromise[blockchain]
};

const getProviders$1 = async(blockchain)=>{

  let providers = getAllProviders();
  if(providers && providers[blockchain]){ return providers[blockchain] }
  
  let window = getWindow();
  if(window._Web3ClientGetProvidersPromise && window._Web3ClientGetProvidersPromise[blockchain]) { return await window._Web3ClientGetProvidersPromise[blockchain] }

  if(!window._Web3ClientGetProvidersPromise){ window._Web3ClientGetProvidersPromise = {}; }
  window._Web3ClientGetProvidersPromise[blockchain] = new Promise(async(resolve)=> {
    await setProviderEndpoints$1(blockchain, Blockchains[blockchain].endpoints);
    resolve(getWindow()._Web3ClientProviders[blockchain]);
  });

  return await window._Web3ClientGetProvidersPromise[blockchain]
};

var Solana = {
  getProvider: getProvider$1,
  getProviders: getProviders$1,
  setProviderEndpoints: setProviderEndpoints$1,
  setProvider: setProvider$1,
};

let supported$1 = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base'];
supported$1.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base'];
supported$1.solana = ['solana'];

function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let getCacheStore = () => {
  if (getWindow()._Web3ClientCacheStore == undefined) {
    getWindow()._Web3ClientCacheStore = {};
  }
  return getWindow()._Web3ClientCacheStore
};

let getPromiseStore = () => {
  if (getWindow()._Web3ClientPromiseStore == undefined) {
    getWindow()._Web3ClientPromiseStore = {};
  }
  return getWindow()._Web3ClientPromiseStore
};

let set = function ({ key, value, expires }) {
  getCacheStore()[key] = {
    expiresAt: Date.now() + expires,
    value,
  };
};

let get = function ({ key, expires }) {
  let cachedEntry = getCacheStore()[key];
  if (_optionalChain$1([cachedEntry, 'optionalAccess', _ => _.expiresAt]) > Date.now()) {
    return cachedEntry.value
  }
};

let getPromise = function({ key }) {
  return getPromiseStore()[key]
};

let setPromise = function({ key, promise }) {
  getPromiseStore()[key] = promise;
  return promise
};

let deletePromise = function({ key }) {
  getPromiseStore()[key] = undefined; 
};

let cache = function ({ call, key, expires = 0 }) {
  return new Promise((resolve, reject)=>{
    let value;
    key = JSON.stringify(key);
    
    // get existing promise (of a previous pending request asking for the exact same thing)
    let existingPromise = getPromise({ key });
    if(existingPromise) { 
      return existingPromise
        .then(resolve)
        .catch(reject)
    }

    setPromise({ key, promise: new Promise((resolveQueue, rejectQueue)=>{
      if (expires === 0) {
        return call()
          .then((value)=>{
            resolve(value);
            resolveQueue(value);
          })
          .catch((error)=>{
            reject(error);
            rejectQueue(error);
          })
      }
      
      // get cached value
      value = get({ key, expires });
      if (value) {
        resolve(value);
        resolveQueue(value);
        return value
      }

      // set new cache value
      call()
        .then((value)=>{
          if (value) {
            set({ key, value, expires });
          }
          resolve(value);
          resolveQueue(value);
        })
        .catch((error)=>{
          reject(error);
          rejectQueue(error);
        });
      })
    }).then(()=>{
      deletePromise({ key });
    }).catch(()=>{
      deletePromise({ key });
    });
  })
};

const getProvider = async (blockchain)=>{

  if(supported$1.evm.includes(blockchain)) {


    return await EVM.getProvider(blockchain)


  } else if(supported$1.solana.includes(blockchain)) {


    return await Solana.getProvider(blockchain)


  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
};

let paramsToContractArgs = ({ contract, method, params }) => {
  let fragment = contract.interface.fragments.find((fragment) => {
    return fragment.name == method
  });

  return fragment.inputs.map((input, index) => {
    if (Array.isArray(params)) {
      return params[index]
    } else {
      return params[input.name]
    }
  })
};

const contractCall = ({ address, api, method, params, provider, block }) => {
  const contract = new ethers.Contract(address, api, provider);
  const args = paramsToContractArgs({ contract, method, params });
  const fragment = contract.interface.fragments.find((fragment)=>fragment.name === method);
  if(contract[method] === undefined) {
    method = `${method}(${fragment.inputs.map((input)=>input.type).join(',')})`;
  }
  if(fragment && fragment.stateMutability === 'nonpayable') {
    return contract.callStatic[method](...args, { blockTag: block })
  } else {
    return contract[method](...args, { blockTag: block })
  }
};

const balance$1 = ({ address, provider }) => {
  return provider.getBalance(address)
};

const transactionCount = ({ address, provider }) => {
  return provider.getTransactionCount(address)
};

const singleRequest$1 = ({ blockchain, address, api, method, params, block, provider }) =>{
  if (api) {
    return contractCall({ address, api, method, params, provider, block })
  } else if (method === 'latestBlockNumber') {
    return provider.getBlockNumber()
  } else if (method === 'balance') {
    return balance$1({ address, provider })
  } else if (method === 'transactionCount') {
    return transactionCount({ address, provider })
  }
};

var requestEVM = async ({ blockchain, address, api, method, params, block, timeout, strategy }) => {

  strategy = strategy ? strategy : (getConfiguration().strategy || 'failover');
  timeout = timeout ? timeout : (getConfiguration().timeout || undefined);

  if(strategy === 'fastest') {

    const providers = await EVM.getProviders(blockchain);
    
    let allRequestsFailed = [];

    const allRequestsInParallel = providers.map((provider)=>{
      return new Promise((resolve)=>{
        allRequestsFailed.push(
          singleRequest$1({ blockchain, address, api, method, params, block, provider }).then(resolve)
        );
      })
    });
    
    const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")); }, timeout || 10000));

    allRequestsFailed = Promise.all(allRequestsFailed.map((request)=>{
      return new Promise((resolve)=>{ request.catch(resolve); })
    })).then(()=>{ return });

    return Promise.race([...allRequestsInParallel, timeoutPromise, allRequestsFailed])

  } else { // failover

    const provider = await EVM.getProvider(blockchain);
    const request = singleRequest$1({ blockchain, address, api, method, params, block, provider });
    
    if(timeout) {
      timeout = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")); }, timeout));
      return Promise.race([request, timeout])
    } else {
      return request
    }
  }
};

const accountInfo = async ({ address, api, method, params, provider, block }) => {
  const info = await provider.getAccountInfo(new PublicKey(address));
  if(!info || !info.data) { return }
  return api.decode(info.data)
};

const balance = ({ address, provider }) => {
  return provider.getBalance(new PublicKey(address))
};

const singleRequest = async({ blockchain, address, api, method, params, block, provider, providers })=> {

  try {

    if(method == undefined || method === 'getAccountInfo') {
      if(api == undefined) {
        api = ACCOUNT_LAYOUT; 
      }
      return await accountInfo({ address, api, method, params, provider, block })
    } else if(method === 'getProgramAccounts') {
      return await provider.getProgramAccounts(new PublicKey(address), params).then((accounts)=>{
        if(api){
          return accounts.map((account)=>{
            account.data = api.decode(account.account.data);
            return account
          })
        } else {
          return accounts
        }
      })
    } else if(method === 'getTokenAccountBalance') {
      return await provider.getTokenAccountBalance(new PublicKey(address))
    } else if (method === 'latestBlockNumber') {
      return await provider.getSlot(params ? params : undefined)
    } else if (method === 'balance') {
      return await balance({ address, provider })
    }

  } catch (error){
    if(providers && error && [
      'Failed to fetch', 'limit reached', '504', '503', '502', '500', '429', '426', '422', '413', '409', '408', '406', '405', '404', '403', '402', '401', '400'
    ].some((errorType)=>error.toString().match(errorType))) {
      let nextProvider = providers[providers.indexOf(provider)+1] || providers[0];
      return singleRequest({ blockchain, address, api, method, params, block, provider: nextProvider, providers })
    } else {
      throw error
    }
  }
};

var requestSolana = async ({ blockchain, address, api, method, params, block, timeout, strategy }) => {

  strategy = strategy ? strategy : (getConfiguration().strategy || 'failover');
  timeout = timeout ? timeout : (getConfiguration().timeout || undefined);

  const providers = await Solana.getProviders(blockchain);

  if(strategy === 'fastest') {

    let allRequestsFailed = [];

    const allRequestsInParallel = providers.map((provider)=>{
      return new Promise((resolve)=>{
        allRequestsFailed.push(
          singleRequest({ blockchain, address, api, method, params, block, provider }).then(resolve)
        );
      })
    });
    
    const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")); }, timeout || 10000));

    allRequestsFailed = Promise.all(allRequestsFailed.map((request)=>{
      return new Promise((resolve)=>{ request.catch(resolve); })
    })).then(()=>{ return });

    return Promise.race([...allRequestsInParallel, timeoutPromise, allRequestsFailed])

  } else { // failover

    const provider = await Solana.getProvider(blockchain);
    const request = singleRequest({ blockchain, address, api, method, params, block, provider, providers });

    if(timeout) {
      timeout = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")); }, timeout));
      return Promise.race([request, timeout])
    } else {
      return request
    }
  }
};

var parseUrl = (url) => {
  if (typeof url == 'object') {
    return url
  }
  let deconstructed = url.match(/(?<blockchain>\w+):\/\/(?<part1>[\w\d]+)(\/(?<part2>[\w\d]+)*)?/);

  if(deconstructed.groups.part2 == undefined) {
    if(deconstructed.groups.part1.match(/\d/)) {
      return {
        blockchain: deconstructed.groups.blockchain,
        address: deconstructed.groups.part1
      }
    } else {
      return {
        blockchain: deconstructed.groups.blockchain,
        method: deconstructed.groups.part1
      }
    }
  } else {
    return {
      blockchain: deconstructed.groups.blockchain,
      address: deconstructed.groups.part1,
      method: deconstructed.groups.part2
    }
  }
};

const request = async function (url, options) {
  
  const { blockchain, address, method } = parseUrl(url);
  const { api, params, cache: cache$1, block, timeout, strategy, cacheKey } = (typeof(url) == 'object' ? url : options) || {};

  return await cache({
    expires: cache$1 || 0,
    key: cacheKey || [blockchain, address, method, params, block],
    call: async()=>{
      if(supported$1.evm.includes(blockchain)) {


        return await requestEVM({ blockchain, address, api, method, params, block, strategy, timeout })


      } else if(supported$1.solana.includes(blockchain)) {


        return await requestSolana({ blockchain, address, api, method, params, block, strategy, timeout })


      } else {
        throw 'Unknown blockchain: ' + blockchain
      }  
    }
  })
};

const getWSolSenderAccountKeypairIfNeeded = async ({ paymentRoute })=> {

  if(
    paymentRoute.fromToken.address === Blockchains.solana.currency.address &&
    paymentRoute.toToken.address !== Blockchains.solana.currency.address
  ){
    return Keypair.generate()
  }
};

const getWSolEscrowAccountKeypairIfNeeded = async ({ paymentRoute })=> {

  if(
    paymentRoute.fromToken.address !== Blockchains.solana.currency.address &&
    paymentRoute.toToken.address === Blockchains.solana.currency.address
  ){
    return Keypair.generate()
  }
};

const createWSolSenderAccount = async ({ wSolSenderAccountKeypair, paymentRoute })=>{

  if(!wSolSenderAccountKeypair) {
    return
  }

  const wSolStartAmount = paymentRoute.fromToken.address === Blockchains.solana.currency.address ? new BN(paymentRoute.fromAmount) : new BN('0');
  const provider = await getProvider('solana');
  const rent = new BN(await provider.getMinimumBalanceForRentExemption(Token.solana.TOKEN_LAYOUT.span));
  const owner = paymentRoute.fromAddress;
  const lamports = wSolStartAmount.add(rent);

  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: new PublicKey(owner),
    newAccountPubkey: wSolSenderAccountKeypair.publicKey,
    programId: new PublicKey(Token.solana.TOKEN_PROGRAM),
    space: Token.solana.TOKEN_LAYOUT.span,
    lamports
  });

  const initializeAccountInstruction = Token.solana.initializeAccountInstruction({
    account: wSolSenderAccountKeypair.publicKey.toString(),
    token: Blockchains.solana.wrapped.address,
    owner
  });

  return [
    createAccountInstruction,
    initializeAccountInstruction
  ]
};

const createEscrowOutWSolAccount = async ({ wSolEscrowAccountKeypair, paymentRoute })=>{

  if(!wSolEscrowAccountKeypair) {
    return
  }

  const provider = await getProvider('solana');
  const rent = new BN(await provider.getMinimumBalanceForRentExemption(Token.solana.TOKEN_LAYOUT.span));
  const owner = await getEscrowSolAccountPublicKey();

  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: new PublicKey(paymentRoute.fromAddress),
    newAccountPubkey: wSolEscrowAccountKeypair.publicKey,
    programId: new PublicKey(Token.solana.TOKEN_PROGRAM),
    space: Token.solana.TOKEN_LAYOUT.span,
    lamports: rent
  });

  const initializeAccountInstruction = Token.solana.initializeAccountInstruction({
    account: wSolEscrowAccountKeypair.publicKey.toString(),
    token: Blockchains.solana.wrapped.address,
    owner: owner.toString()
  });

  return [
    createAccountInstruction,
    initializeAccountInstruction
  ]
};

const getMiddleToken = ({ paymentRoute })=>{
  let path = [...paymentRoute.exchangeRoutes[0].path];
  if(path.indexOf(Blockchains.solana.currency.address) > -1) { path.splice(path.indexOf(Blockchains.solana.currency.address), 1); }
  if(path.indexOf(paymentRoute.fromToken.address) > -1) { path.splice(path.indexOf(paymentRoute.fromToken.address), 1); }
  if(path.indexOf(paymentRoute.toToken.address) > -1) { path.splice(path.indexOf(paymentRoute.toToken.address), 1); }

  if(path.length === 2 && path[0] === Blockchains.solana.wrapped.address) {
    return path[1]
  } else { 
    return path[0]
  }
};

const getMiddleTokenAccountAddress = async ({ paymentRoute })=>{

  return await Token.solana.findProgramAddress({
    token: getMiddleToken({ paymentRoute }),
    owner: paymentRoute.fromAddress
  })
};

const getMiddleTokenAccount = async ({ paymentRoute })=> {

  return await request({
    blockchain: 'solana',
    address: await getMiddleTokenAccountAddress({ paymentRoute }),
    api: Token.solana.TOKEN_LAYOUT,
    cache: 1000
  })
};

const createTokenMiddleAccount = async ({ paymentRoute })=>{

  if(
    paymentRoute.exchangeRoutes.length === 0 ||
    getFixedPath(paymentRoute.exchangeRoutes[0].path).length <= 2
  ) {
    return
  }

  const middleTokenAccount = await getMiddleTokenAccount({ paymentRoute });
  if(middleTokenAccount) {
    return
  }

  return Token.solana.createAssociatedTokenAccountInstruction({
    token: getMiddleToken({ paymentRoute }),
    owner: paymentRoute.fromAddress,
    payer: paymentRoute.fromAddress,
  })
};

const closeWSolSenderAccount = async ({ wSolSenderAccountKeypair, paymentRoute })=>{

  if(!wSolSenderAccountKeypair) {
    return
  }
  
  return Token.solana.closeAccountInstruction({
    account: wSolSenderAccountKeypair.publicKey.toString(),
    owner: paymentRoute.fromAddress
  })
};

const getPaymentsAccountAddress = async({ from })=>{
  let seeds = [Buffer.from("payments"), new PublicKey(from).toBuffer()];

  let [ pdaPublicKey ] = await PublicKey.findProgramAddress(
    seeds, new PublicKey(solanaRouters.solana.address)
  );

  return pdaPublicKey
};

const getPaymentsAccountData = async({ from })=>{
  let address = (await getPaymentsAccountAddress({ from })).toString();
  return await request({
    blockchain: 'solana',
    address,
    api: struct([u64('anchorDiscriminator'), u64('nonce')]),
    cache: 1000
  })
};

const createPaymentsAccount = async({ from })=> {

  let paymentsAccountData = await getPaymentsAccountData({ from });
  if(paymentsAccountData) { 
    return
  }
  
  const keys = [
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: new PublicKey(from), isSigner: true, isWritable: true },
    { pubkey: await getPaymentsAccountAddress({ from }), isSigner: false, isWritable: true },
  ];

  const data = Buffer.alloc(solanaRouters.solana.api.createPaymentsAccount.layout.span);
  solanaRouters.solana.api.createPaymentsAccount.layout.encode({
    anchorDiscriminator: solanaRouters.solana.api.createPaymentsAccount.anchorDiscriminator
  }, data);
  
  return new TransactionInstruction({ 
    keys,
    programId: new PublicKey(solanaRouters.solana.address),
    data
  })
};

const getPaymentSenderTokenAccountAddress = async ({ paymentRoute })=> {

  return await Token.solana.findProgramAddress({
    token: paymentRoute.fromToken.address,
    owner: paymentRoute.fromAddress
  })
};

const getPaymentReceiverTokenAccountAddress = async ({ paymentRoute })=> {

  return await Token.solana.findProgramAddress({
    token: paymentRoute.toToken.address,
    owner: paymentRoute.toAddress
  })
};

const getPaymentReceiverTokenAccount = async ({ paymentRoute })=> {

  return await Token.solana.findAccount({
    token: paymentRoute.toToken.address,
    owner: paymentRoute.toAddress
  })  
};

const createPaymentReceiverAccount = async({ paymentRoute })=> {
  
  if(paymentRoute.toToken.address === Blockchains.solana.currency.address) {

    const paymentReceiverBalance = await request({ blockchain: 'solana', method: 'balance', address: paymentRoute.toAddress });
    const provider = await getProvider('solana');
    const rent = new BN(await provider.getMinimumBalanceForRentExemption(0));
    const paymentAmount = new BN(paymentRoute.toAmount);

    if(new BN(paymentReceiverBalance).add(paymentAmount).gt(rent)) {
      return
    }
    
    return SystemProgram.transfer({
      fromPubkey: new PublicKey(paymentRoute.fromAddress),
      toPubkey: new PublicKey(paymentRoute.toAddress),
      lamports: rent.sub(paymentAmount)
    })
  
  } else {

    const token = paymentRoute.toToken.address;

    const paymentReceiverTokenAccount = await getPaymentReceiverTokenAccount({ paymentRoute });
    if(paymentReceiverTokenAccount) {
      return
    }

    return Token.solana.createAssociatedTokenAccountInstruction({
      token,
      owner: paymentRoute.toAddress,
      payer: paymentRoute.fromAddress,
    })
  }
};

const getFeeReceiverTokenAccountAddress = async ({ paymentRoute })=> {

  return await Token.solana.findProgramAddress({
    token: paymentRoute.toToken.address,
    owner: paymentRoute.fee.receiver
  })  
};

const getFeeReceiverTokenAccount = async ({ paymentRoute })=> {

  return await Token.solana.findAccount({
    token: paymentRoute.toToken.address,
    owner: paymentRoute.fee.receiver
  })
};

const createFeeReceiverAccount = async({ paymentRoute })=> {
  
  if(!paymentRoute.fee) {
    return
  }
  
  if(paymentRoute.toToken.address === Blockchains.solana.currency.address) {

    const feeReceiverBalance = await request({ blockchain: 'solana', method: 'balance', address: paymentRoute.fee.receiver });
    const provider = await getProvider('solana');
    const rent = new BN(await provider.getMinimumBalanceForRentExemption(0));
    const feeAmount = new BN(paymentRoute.feeAmount);

    if(new BN(feeReceiverBalance).add(feeAmount).gt(rent)) {
      return
    }
    
    return SystemProgram.transfer({
      fromPubkey: new PublicKey(paymentRoute.fromAddress),
      toPubkey: new PublicKey(paymentRoute.fee.receiver),
      lamports: rent.sub(feeAmount)
    })
  
  } else {

    const token = paymentRoute.toToken.address;

    const feeReceiverTokenAccount = await getFeeReceiverTokenAccount({ paymentRoute });
    
    if(feeReceiverTokenAccount) {
      return
    }

    return Token.solana.createAssociatedTokenAccountInstruction({
      token,
      owner: paymentRoute.fee.receiver,
      payer: paymentRoute.fromAddress,
    })
  }
};

const getEscrowSolAccountPublicKey = async()=>{

  let seeds = [Buffer.from("escrow_sol")];
  
  let [ pdaPublicKey, bump ] = await PublicKey.findProgramAddress(
    seeds, new PublicKey(solanaRouters.solana.address)
  );

  return pdaPublicKey
};

const getEscrowSolAccountData = async({ paymentRoute })=>{
  return await request({
    blockchain: 'solana',
    address: (await getEscrowSolAccountPublicKey()).toString(),
    api: struct([ u64('amount'), publicKey('owner') ]),
    cache: 1000
  })
};

const getEscrowAccountPublicKey = async({ paymentRoute })=>{

  let seeds = [
    Buffer.from("escrow"),
    new PublicKey(paymentRoute.toToken.address === Blockchains.solana.currency.address ? Blockchains.solana.wrapped.address : paymentRoute.toToken.address).toBuffer()
  ];
  
  let [ pdaPublicKey, bump ] = await PublicKey.findProgramAddress(
    seeds, new PublicKey(solanaRouters.solana.address)
  );

  return pdaPublicKey
};

const getEscrowAccountData = async({ paymentRoute })=>{
  return await request({
    blockchain: 'solana',
    address: (await getEscrowAccountPublicKey({ paymentRoute })).toString(),
    api: Token.solana.TOKEN_LAYOUT,
    cache: 1000
  })
};

const createEscrowOutTokenAccount = async({ paymentRoute })=> {

  if(paymentRoute.exchangeRoutes.length === 0 || paymentRoute.toToken.address === Blockchains.solana.currency.address) {
    return
  }

  const escrowAccount = await getEscrowAccountData({ paymentRoute });

  if(escrowAccount) {
    return
  }

  const keys = [
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: new PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
    { pubkey: new PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
    { pubkey: new PublicKey(paymentRoute.toToken.address === Blockchains.solana.currency.address ? Blockchains.solana.wrapped.address : paymentRoute.toToken.address), isSigner: false, isWritable: true },
    { pubkey: await getEscrowAccountPublicKey({ paymentRoute }), isSigner: false, isWritable: true },
  ];

  const data = Buffer.alloc(solanaRouters.solana.api.createEscrowTokenAccount.layout.span);
  solanaRouters.solana.api.createEscrowTokenAccount.layout.encode({
    anchorDiscriminator: solanaRouters.solana.api.createEscrowTokenAccount.anchorDiscriminator
  }, data);
  
  return new TransactionInstruction({
    keys,
    programId: new PublicKey(solanaRouters.solana.address),
    data
  })
};

const createEscrowOutSolAccount = async({ paymentRoute })=> {

  if(
    paymentRoute.exchangeRoutes.length === 0 ||
    paymentRoute.toToken.address != Blockchains.solana.currency.address
  ) {
    return
  }

  const escrowAccount = await getEscrowSolAccountData({ paymentRoute });

  if(escrowAccount) {
    return
  }

  const keys = [
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: new PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
    { pubkey: await getEscrowSolAccountPublicKey(), isSigner: false, isWritable: true },
  ];

  const data = Buffer.alloc(solanaRouters.solana.api.createEscrowSolAccount.layout.span);
  solanaRouters.solana.api.createEscrowSolAccount.layout.encode({
    anchorDiscriminator: solanaRouters.solana.api.createEscrowSolAccount.anchorDiscriminator
  }, data);
  
  return new TransactionInstruction({ 
    keys,
    programId: new PublicKey(solanaRouters.solana.address),
    data
  })
};

const getFixedPath = (path)=> path.filter((step)=>step!==Blockchains.solana.currency.address);

const getPaymentMethod = ({ paymentRoute })=>{

  if(
    paymentRoute.fromToken.address === Blockchains.solana.currency.address &&
    paymentRoute.toToken.address === Blockchains.solana.currency.address
  ){

    return 'routeSol'

  } else if (
    paymentRoute.fromToken.address !== Blockchains.solana.currency.address &&
    paymentRoute.toToken.address !== Blockchains.solana.currency.address &&
    paymentRoute.exchangeRoutes.length === 0
  ) {

    return 'routeToken'

  } else if (
    paymentRoute.exchangeRoutes.length > 0 &&
    getFixedPath(paymentRoute.exchangeRoutes[0].path).length === 2
  ) {

    if(paymentRoute.toToken.address === Blockchains.solana.currency.address) {

      return 'routeOrcaSwapSolOut'

    } else {

      return 'routeOrcaSwap'

    }

  } else if (
    paymentRoute.exchangeRoutes.length > 0 &&
    getFixedPath(paymentRoute.exchangeRoutes[0].path).length > 2
  ) {

    if(paymentRoute.toToken.address === Blockchains.solana.currency.address) {

      return 'routeOrcaTwoHopSwapSolOut'

    } else {

      return 'routeOrcaTwoHopSwap'

    }

  } else {

    throw 'Payment method does not exist!'

  }
};

const getDeadline = ()=>{
  return Math.ceil(new Date().getTime()/1000)+1800 // 30 Minutes (lower causes wallet simulation issues)
};

const getNonce = (paymentsAccountData)=>{
  return paymentsAccountData ? paymentsAccountData.nonce : new BN('0')
};

const routeSol = async({ paymentRoute, nonce, deadline }) =>{

  const paymentReceiverPublicKey = new PublicKey(paymentRoute.toAddress);
  const feeReceiverPublicKey = paymentRoute.fee ? new PublicKey(paymentRoute.fee.receiver) : paymentReceiverPublicKey;

  const keys = [
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: new PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
    { pubkey: await getPaymentsAccountAddress({ from: paymentRoute.fromAddress }), isSigner: false, isWritable: true },
    { pubkey: paymentReceiverPublicKey, isSigner: false, isWritable: true },
    { pubkey: feeReceiverPublicKey, isSigner: false, isWritable: true },
  ];

  const data = Buffer.alloc(solanaRouters.solana.api.routeSol.layout.span);
  solanaRouters.solana.api.routeSol.layout.encode({
    anchorDiscriminator: solanaRouters.solana.api.routeSol.anchorDiscriminator,
    nonce,
    paymentAmount: new BN(paymentRoute.toAmount.toString()),
    feeAmount: new BN((paymentRoute.feeAmount || '0').toString()),
    deadline: new BN(deadline),
  }, data);
  
  return new TransactionInstruction({
    keys,
    programId: new PublicKey(solanaRouters.solana.address),
    data
  })
};

const routeToken = async({ paymentRoute, nonce, deadline }) =>{

  const senderTokenAccountAddress = await getPaymentSenderTokenAccountAddress({ paymentRoute });
  const paymentReceiverTokenAccountAddress = await getPaymentReceiverTokenAccountAddress({ paymentRoute });
  const feeReceiverTokenAccountAddress = paymentRoute.fee ? await getFeeReceiverTokenAccountAddress({ paymentRoute }) : paymentReceiverTokenAccountAddress;

  const keys = [
    { pubkey: new PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
    { pubkey: new PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
    { pubkey: await getPaymentsAccountAddress({ from: paymentRoute.fromAddress }), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(senderTokenAccountAddress), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(paymentReceiverTokenAccountAddress), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(feeReceiverTokenAccountAddress), isSigner: false, isWritable: true },
  ];

  const data = Buffer.alloc(solanaRouters.solana.api.routeToken.layout.span);
  solanaRouters.solana.api.routeToken.layout.encode({
    anchorDiscriminator: solanaRouters.solana.api.routeToken.anchorDiscriminator,
    nonce,
    paymentAmount: new BN(paymentRoute.toAmount.toString()),
    feeAmount: new BN((paymentRoute.feeAmount || '0').toString()),
    deadline: new BN(deadline),
  }, data);
  
  return new TransactionInstruction({ 
    keys,
    programId: new PublicKey(solanaRouters.solana.address),
    data 
  })    
};

const routeOrcaSwap = async({ paymentRoute, nonce, wSolSenderAccountKeypair, deadline }) =>{

  const senderTokenAccountAddress = wSolSenderAccountKeypair ? wSolSenderAccountKeypair.publicKey : await getPaymentSenderTokenAccountAddress({ paymentRoute });
  const paymentReceiverTokenAccountAddress = await getPaymentReceiverTokenAccountAddress({ paymentRoute });
  const feeReceiverTokenAccountAddress = paymentRoute.fee ? await getFeeReceiverTokenAccountAddress({ paymentRoute }) : paymentReceiverTokenAccountAddress;
  const escrowOutPublicKey = await getEscrowAccountPublicKey({ paymentRoute });
  const exchangeRouteTransaction = await paymentRoute.exchangeRoutes[0].getTransaction({ account: paymentRoute.fromAddress });
  const exchangeRouteSwapInstruction = exchangeRouteTransaction.instructions.find((instruction)=>instruction.programId.toString() === solanaRouters.solana.ammProgram);

  const SWAP_LAYOUT = struct([
    u64("anchorDiscriminator"),
    u64("amount"),
    u64("otherAmountThreshold"),
    u128("sqrtPriceLimit"),
    bool("amountSpecifiedIsInput"),
    bool("aToB"),
  ]);
  const exchangeRouteSwapInstructionData = SWAP_LAYOUT.decode(exchangeRouteSwapInstruction.data);

  const keys = [
    // token_program
    { pubkey: new PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
    // amm_program
    { pubkey: new PublicKey(solanaRouters.solana.ammProgram), isSigner: false, isWritable: false },
    // sender
    { pubkey: new PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
    // payments
    { pubkey: await getPaymentsAccountAddress({ from: paymentRoute.fromAddress }), isSigner: false, isWritable: true },
    // sender_token_account
    { pubkey: new PublicKey(senderTokenAccountAddress), isSigner: false, isWritable: true },
    // whirlpool
    exchangeRouteSwapInstruction.keys[2],
    // token_vault_a
    exchangeRouteSwapInstruction.keys[4],
    // token_vault_b
    exchangeRouteSwapInstruction.keys[6],
    // tick_array_0
    exchangeRouteSwapInstruction.keys[7],
    // tick_array_1
    exchangeRouteSwapInstruction.keys[8],
    // tick_array_2
    exchangeRouteSwapInstruction.keys[9],
    // oracle
    exchangeRouteSwapInstruction.keys[10],
    // escrow_out
    { pubkey: escrowOutPublicKey, isSigner: false, isWritable: true },
    // payment_receiver
    { pubkey: new PublicKey(paymentReceiverTokenAccountAddress), isSigner: false, isWritable: true },
    // fee_receiver
    { pubkey: new PublicKey(feeReceiverTokenAccountAddress), isSigner: false, isWritable: true },
  ];

  const data = Buffer.alloc(solanaRouters.solana.api.routeOrcaSwap.layout.span);
  solanaRouters.solana.api.routeOrcaSwap.layout.encode({
    anchorDiscriminator: solanaRouters.solana.api.routeOrcaSwap.anchorDiscriminator,
    nonce,
    amountIn: exchangeRouteSwapInstructionData.amount,
    sqrtPriceLimit: exchangeRouteSwapInstructionData.sqrtPriceLimit,
    amountSpecifiedIsInput: exchangeRouteSwapInstructionData.amountSpecifiedIsInput,
    aToB: exchangeRouteSwapInstructionData.aToB,
    paymentAmount: new BN(paymentRoute.toAmount.toString()),
    feeAmount: new BN((paymentRoute.feeAmount || '0').toString()),
    deadline: new BN(deadline),
  }, data);
  
  return new TransactionInstruction({ 
    keys,
    programId: new PublicKey(solanaRouters.solana.address),
    data
  })
};

const routeOrcaSwapSolOut = async({ paymentRoute, nonce, wSolEscrowAccountKeypair, deadline }) =>{

  const senderTokenAccountAddress = await getPaymentSenderTokenAccountAddress({ paymentRoute });
  const escrowOutWsolPublicKey = wSolEscrowAccountKeypair.publicKey;
  const exchangeRouteTransaction = await paymentRoute.exchangeRoutes[0].getTransaction({ account: paymentRoute.fromAddress });
  const exchangeRouteSwapInstruction = exchangeRouteTransaction.instructions.find((instruction)=>instruction.programId.toString() === solanaRouters.solana.ammProgram);

  const SWAP_LAYOUT = struct([
    u64("anchorDiscriminator"),
    u64("amount"),
    u64("otherAmountThreshold"),
    u128("sqrtPriceLimit"),
    bool("amountSpecifiedIsInput"),
    bool("aToB"),
  ]);
  const exchangeRouteSwapInstructionData = SWAP_LAYOUT.decode(exchangeRouteSwapInstruction.data);

  const keys = [
    // system_program
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    // token_program
    { pubkey: new PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
    // amm_program
    { pubkey: new PublicKey(solanaRouters.solana.ammProgram), isSigner: false, isWritable: false },
    // sender
    { pubkey: new PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
    // payments
    { pubkey: await getPaymentsAccountAddress({ from: paymentRoute.fromAddress }), isSigner: false, isWritable: true },
    // sender_token_account
    { pubkey: new PublicKey(senderTokenAccountAddress), isSigner: false, isWritable: true },
    // whirlpool
    exchangeRouteSwapInstruction.keys[2],
    // token_vault_a
    exchangeRouteSwapInstruction.keys[4],
    // token_vault_b
    exchangeRouteSwapInstruction.keys[6],
    // tick_array_0
    exchangeRouteSwapInstruction.keys[7],
    // tick_array_1
    exchangeRouteSwapInstruction.keys[8],
    // tick_array_2
    exchangeRouteSwapInstruction.keys[9],
    // oracle
    exchangeRouteSwapInstruction.keys[10],
    // escrow_out
    { pubkey: escrowOutWsolPublicKey, isSigner: false, isWritable: true },
    // escrow_out_sol
    { pubkey: await getEscrowSolAccountPublicKey(), isSigner: false, isWritable: true },
    // payment_receiver
    { pubkey: new PublicKey(paymentRoute.toAddress), isSigner: false, isWritable: true },
    // fee_receiver
    { pubkey: new PublicKey(paymentRoute.fee ? paymentRoute.fee.receiver : paymentRoute.toAddress), isSigner: false, isWritable: true },
  ];

  const data = Buffer.alloc(solanaRouters.solana.api.routeOrcaSwapSolOut.layout.span);
  solanaRouters.solana.api.routeOrcaSwapSolOut.layout.encode({
    anchorDiscriminator: solanaRouters.solana.api.routeOrcaSwapSolOut.anchorDiscriminator,
    nonce,
    amountIn: exchangeRouteSwapInstructionData.amount,
    sqrtPriceLimit: exchangeRouteSwapInstructionData.sqrtPriceLimit,
    amountSpecifiedIsInput: exchangeRouteSwapInstructionData.amountSpecifiedIsInput,
    aToB: exchangeRouteSwapInstructionData.aToB,
    paymentAmount: new BN(paymentRoute.toAmount.toString()),
    feeAmount: new BN((paymentRoute.feeAmount || '0').toString()),
    deadline: new BN(deadline),
  }, data);
  
  return new TransactionInstruction({ 
    keys,
    programId: new PublicKey(solanaRouters.solana.address),
    data
  })
};

const routeOrcaTwoHopSwap = async({ paymentRoute, nonce, wSolSenderAccountKeypair, deadline }) =>{

  const paymentReceiverTokenAccountPublicKey = new PublicKey(await getPaymentReceiverTokenAccountAddress({ paymentRoute }));
  const feeReceiverTokenAccountPublicKey = paymentRoute.fee ? new PublicKey(await getFeeReceiverTokenAccountAddress({ paymentRoute })) : paymentReceiverTokenAccountPublicKey;
  const escrowOutPublicKey = await getEscrowAccountPublicKey({ paymentRoute });
  const middleTokenAccountPublicKey = new PublicKey(await getMiddleTokenAccountAddress({ paymentRoute }));
  const exchangeRouteTransaction = await paymentRoute.exchangeRoutes[0].getTransaction({ account: paymentRoute.fromAddress });
  const exchangeRouteSwapInstruction = exchangeRouteTransaction.instructions.find((instruction)=>instruction.programId.toString() === solanaRouters.solana.ammProgram);
  const senderTokenAccountPublicKey = wSolSenderAccountKeypair ? wSolSenderAccountKeypair.publicKey : new PublicKey(await getPaymentSenderTokenAccountAddress({ paymentRoute }));

  const SWAP_LAYOUT = struct([
    u64("anchorDiscriminator"),
    u64("amount"),
    u64("otherAmountThreshold"),
    bool("amountSpecifiedIsInput"),
    bool("aToBOne"),
    bool("aToBTwo"),
    u128("sqrtPriceLimitOne"),
    u128("sqrtPriceLimitTwo"),
  ]);
  const exchangeRouteSwapInstructionData = SWAP_LAYOUT.decode(exchangeRouteSwapInstruction.data);

  const keys = [
    // token_program
    { pubkey: new PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
    // amm_program
    { pubkey: new PublicKey(solanaRouters.solana.ammProgram), isSigner: false, isWritable: false },
    // sender
    { pubkey: new PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
    // payments
    { pubkey: await getPaymentsAccountAddress({ from: paymentRoute.fromAddress }), isSigner: false, isWritable: true },
    // whirlpool_one
    exchangeRouteSwapInstruction.keys[2],
    // whirlpool_two
    exchangeRouteSwapInstruction.keys[3],
    // sender_token_account
    { pubkey: senderTokenAccountPublicKey, isSigner: false, isWritable: true },
    // token_vault_one_a
    exchangeRouteSwapInstruction.keys[5],
    // token_vault_one_b
    exchangeRouteSwapInstruction.keys[7],
    // middle_token_account
    { pubkey: middleTokenAccountPublicKey, isSigner: false, isWritable: true },
    // token_vault_two_a
    exchangeRouteSwapInstruction.keys[9],
    // token_vault_two_b
    exchangeRouteSwapInstruction.keys[11],
    // tick_array_one_0
    exchangeRouteSwapInstruction.keys[12],
    // tick_array_one_1
    exchangeRouteSwapInstruction.keys[13],
    // tick_array_one_2
    exchangeRouteSwapInstruction.keys[14],
    // tick_array_two_0
    exchangeRouteSwapInstruction.keys[15],
    // tick_array_two_1
    exchangeRouteSwapInstruction.keys[16],
    // tick_array_two_2
    exchangeRouteSwapInstruction.keys[17],
    // oracle_one
    exchangeRouteSwapInstruction.keys[18],
    // oracle_two
    exchangeRouteSwapInstruction.keys[19],
    // escrow_out
    { pubkey: escrowOutPublicKey, isSigner: false, isWritable: true },
    // payment_receiver
    { pubkey: paymentReceiverTokenAccountPublicKey, isSigner: false, isWritable: true },
    // fee_receiver
    { pubkey: feeReceiverTokenAccountPublicKey, isSigner: false, isWritable: true },
  ];

  const data = Buffer.alloc(solanaRouters.solana.api.routeOrcaTwoHopSwap.layout.span);
  solanaRouters.solana.api.routeOrcaTwoHopSwap.layout.encode({
    anchorDiscriminator: solanaRouters.solana.api.routeOrcaTwoHopSwap.anchorDiscriminator,
    nonce,
    amountIn: exchangeRouteSwapInstructionData.amount,
    amountSpecifiedIsInput: exchangeRouteSwapInstructionData.amountSpecifiedIsInput,
    aToBOne: exchangeRouteSwapInstructionData.aToBOne,
    aToBTwo: exchangeRouteSwapInstructionData.aToBTwo,
    sqrtPriceLimitOne: exchangeRouteSwapInstructionData.sqrtPriceLimitOne,
    sqrtPriceLimitTwo: exchangeRouteSwapInstructionData.sqrtPriceLimitTwo,
    paymentAmount: new BN(paymentRoute.toAmount.toString()),
    feeAmount: new BN((paymentRoute.feeAmount || '0').toString()),
    deadline: new BN(deadline),
  }, data);
  
  return new TransactionInstruction({ 
    keys,
    programId: new PublicKey(solanaRouters.solana.address),
    data
  })
};

const routeOrcaTwoHopSwapSolOut = async({ paymentRoute, nonce, wSolEscrowAccountKeypair, deadline }) =>{

  const middleTokenAccountPublicKey = new PublicKey(await getMiddleTokenAccountAddress({ paymentRoute }));
  const exchangeRouteTransaction = await paymentRoute.exchangeRoutes[0].getTransaction({ account: paymentRoute.fromAddress });
  const exchangeRouteSwapInstruction = exchangeRouteTransaction.instructions.find((instruction)=>instruction.programId.toString() === solanaRouters.solana.ammProgram);
  const senderTokenAccountPublicKey = new PublicKey(await getPaymentSenderTokenAccountAddress({ paymentRoute }));

  const SWAP_LAYOUT = struct([
    u64("anchorDiscriminator"),
    u64("amount"),
    u64("otherAmountThreshold"),
    bool("amountSpecifiedIsInput"),
    bool("aToBOne"),
    bool("aToBTwo"),
    u128("sqrtPriceLimitOne"),
    u128("sqrtPriceLimitTwo"),
  ]);
  const exchangeRouteSwapInstructionData = SWAP_LAYOUT.decode(exchangeRouteSwapInstruction.data);

  const keys = [
    // system_program
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    // token_program
    { pubkey: new PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
    // amm_program
    { pubkey: new PublicKey(solanaRouters.solana.ammProgram), isSigner: false, isWritable: false },
    // sender
    { pubkey: new PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
    // payments
    { pubkey: await getPaymentsAccountAddress({ from: paymentRoute.fromAddress }), isSigner: false, isWritable: true },
    // sender_token_account
    { pubkey: senderTokenAccountPublicKey, isSigner: false, isWritable: true },
    // whirlpool_one
    exchangeRouteSwapInstruction.keys[2],
    // whirlpool_two
    exchangeRouteSwapInstruction.keys[3],
    // token_vault_one_a
    exchangeRouteSwapInstruction.keys[5],
    // token_vault_one_b
    exchangeRouteSwapInstruction.keys[7],
    // middle_token_account
    { pubkey: middleTokenAccountPublicKey, isSigner: false, isWritable: true },
    // token_vault_two_a
    exchangeRouteSwapInstruction.keys[9],
    // token_vault_two_b
    exchangeRouteSwapInstruction.keys[11],
    // tick_array_one_0
    exchangeRouteSwapInstruction.keys[12],
    // tick_array_one_1
    exchangeRouteSwapInstruction.keys[13],
    // tick_array_one_2
    exchangeRouteSwapInstruction.keys[14],
    // tick_array_two_0
    exchangeRouteSwapInstruction.keys[15],
    // tick_array_two_1
    exchangeRouteSwapInstruction.keys[16],
    // tick_array_two_2
    exchangeRouteSwapInstruction.keys[17],
    // oracle_one
    exchangeRouteSwapInstruction.keys[18],
    // oracle_two
    exchangeRouteSwapInstruction.keys[19],
    // escrow_out
    { pubkey: wSolEscrowAccountKeypair.publicKey, isSigner: false, isWritable: true },
    // escrow_out_sol
    { pubkey: await getEscrowSolAccountPublicKey(), isSigner: false, isWritable: true },
    // payment_receiver
    { pubkey: new PublicKey(paymentRoute.toAddress), isSigner: false, isWritable: true },
    // fee_receiver
    { pubkey: new PublicKey(paymentRoute.fee ? paymentRoute.fee.receiver : paymentRoute.toAddress), isSigner: false, isWritable: true },
  ];

  const data = Buffer.alloc(solanaRouters.solana.api.routeOrcaTwoHopSwapSolOut.layout.span);
  solanaRouters.solana.api.routeOrcaTwoHopSwapSolOut.layout.encode({
    anchorDiscriminator: solanaRouters.solana.api.routeOrcaTwoHopSwapSolOut.anchorDiscriminator,
    nonce,
    amountIn: exchangeRouteSwapInstructionData.amount,
    amountSpecifiedIsInput: exchangeRouteSwapInstructionData.amountSpecifiedIsInput,
    aToBOne: exchangeRouteSwapInstructionData.aToBOne,
    aToBTwo: exchangeRouteSwapInstructionData.aToBTwo,
    sqrtPriceLimitOne: exchangeRouteSwapInstructionData.sqrtPriceLimitOne,
    sqrtPriceLimitTwo: exchangeRouteSwapInstructionData.sqrtPriceLimitTwo,
    paymentAmount: new BN(paymentRoute.toAmount.toString()),
    feeAmount: new BN((paymentRoute.feeAmount || '0').toString()),
    deadline: new BN(deadline),
  }, data);
  
  return new TransactionInstruction({ 
    keys,
    programId: new PublicKey(solanaRouters.solana.address),
    data
  })
};

const payment = async({ paymentRoute, wSolSenderAccountKeypair, wSolEscrowAccountKeypair, nonce, deadline })=> {

  const paymentMethod = getPaymentMethod({ paymentRoute });

  switch(paymentMethod){
    
    case 'routeSol':
    return await routeSol({ paymentRoute, nonce, deadline });
    
    case 'routeToken':
    return await routeToken({ paymentRoute, nonce, deadline });

    case 'routeOrcaSwap':
    return await routeOrcaSwap({ paymentRoute, nonce, wSolSenderAccountKeypair, deadline });

    case 'routeOrcaSwapSolOut':
    return await routeOrcaSwapSolOut({ paymentRoute, nonce, wSolEscrowAccountKeypair, deadline });

    case 'routeOrcaTwoHopSwap':
    return await routeOrcaTwoHopSwap({ paymentRoute, nonce, wSolSenderAccountKeypair, deadline });

    case 'routeOrcaTwoHopSwapSolOut':
    return await routeOrcaTwoHopSwapSolOut({ paymentRoute, nonce, wSolEscrowAccountKeypair, deadline });

  }

};

const getTransaction$3 = async({ paymentRoute })=> {

  const paymentsAccountData = await getPaymentsAccountData({ from: paymentRoute.fromAddress });
  const deadline = getDeadline();
  const nonce = getNonce(paymentsAccountData);

  const wSolSenderAccountKeypair = await getWSolSenderAccountKeypairIfNeeded({ paymentRoute });
  const wSolEscrowAccountKeypair = await getWSolEscrowAccountKeypairIfNeeded({ paymentRoute });

  let instructions = (
    await Promise.all([
      createPaymentsAccount({ from: paymentRoute.fromAddress }),
      createWSolSenderAccount({ paymentRoute, wSolSenderAccountKeypair }),
      createTokenMiddleAccount({ paymentRoute }),
      createPaymentReceiverAccount({ paymentRoute }),
      createFeeReceiverAccount({ paymentRoute }),
      createEscrowOutSolAccount({ paymentRoute }), // needs to happen before createEscrowOutWSolAccount
      createEscrowOutWSolAccount({ paymentRoute, wSolEscrowAccountKeypair }),
      createEscrowOutTokenAccount({ paymentRoute }),
      payment({ paymentRoute, wSolSenderAccountKeypair, wSolEscrowAccountKeypair, nonce, deadline }),
      closeWSolSenderAccount({ paymentRoute, wSolSenderAccountKeypair }),
    ])
  ).filter(Boolean).flat();

  const transaction = {
    blockchain: paymentRoute.blockchain,
    instructions,
    signers: [wSolSenderAccountKeypair, wSolEscrowAccountKeypair].filter(Boolean),
    alts: [solanaRouters.solana.alt]
  };

  // debug(transaction, paymentRoute)

  transaction.deadline = deadline;
  transaction.nonce = nonce.toString();

  return transaction
};

const API = [{"inputs":[{"internalType":"address","name":"_PERMIT2","type":"address"},{"internalType":"address","name":"_FORWARDER","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ExchangeCallFailed","type":"error"},{"inputs":[],"name":"ExchangeCallMissing","type":"error"},{"inputs":[],"name":"ExchangeNotApproved","type":"error"},{"inputs":[],"name":"ForwardingPaymentFailed","type":"error"},{"inputs":[],"name":"InsufficientBalanceInAfterPayment","type":"error"},{"inputs":[],"name":"InsufficientBalanceOutAfterPayment","type":"error"},{"inputs":[],"name":"NativeFeePaymentFailed","type":"error"},{"inputs":[],"name":"NativePaymentFailed","type":"error"},{"inputs":[],"name":"PaymentDeadlineReached","type":"error"},{"inputs":[],"name":"PaymentToZeroAddressNotAllowed","type":"error"},{"inputs":[],"name":"WrongAmountPaidIn","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"exchange","type":"address"}],"name":"Disabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"exchange","type":"address"}],"name":"Enabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"InternalTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"FORWARDER","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"exchange","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"enable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"exchanges","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"bool","name":"permit2","type":"bool"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"uint256","name":"feeAmount","type":"uint256"},{"internalType":"address","name":"tokenInAddress","type":"address"},{"internalType":"address","name":"exchangeAddress","type":"address"},{"internalType":"address","name":"tokenOutAddress","type":"address"},{"internalType":"address","name":"paymentReceiverAddress","type":"address"},{"internalType":"address","name":"feeReceiverAddress","type":"address"},{"internalType":"uint8","name":"exchangeType","type":"uint8"},{"internalType":"uint8","name":"receiverType","type":"uint8"},{"internalType":"bytes","name":"exchangeCallData","type":"bytes"},{"internalType":"bytes","name":"receiverCallData","type":"bytes"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct IDePayRouterV2.Payment","name":"payment","type":"tuple"}],"name":"pay","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"bool","name":"permit2","type":"bool"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"uint256","name":"feeAmount","type":"uint256"},{"internalType":"address","name":"tokenInAddress","type":"address"},{"internalType":"address","name":"exchangeAddress","type":"address"},{"internalType":"address","name":"tokenOutAddress","type":"address"},{"internalType":"address","name":"paymentReceiverAddress","type":"address"},{"internalType":"address","name":"feeReceiverAddress","type":"address"},{"internalType":"uint8","name":"exchangeType","type":"uint8"},{"internalType":"uint8","name":"receiverType","type":"uint8"},{"internalType":"bytes","name":"exchangeCallData","type":"bytes"},{"internalType":"bytes","name":"receiverCallData","type":"bytes"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct IDePayRouterV2.Payment","name":"payment","type":"tuple"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IPermit2.PermitDetails","name":"details","type":"tuple"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IPermit2.PermitSingle","name":"permitSingle","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"pay","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"pendingOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

var routers$1 = {

  ethereum: {
    address: '0x6466F27B169C908Ba8174d80aEfa7173CbC3D0c7',
    api: API
  },

  bsc: {
    address: '0x7ea09401db4692a8AEF4111b75bD32AE758f552A',
    api: API
  },

  polygon: {
    address: '0x50CFAB577623B1359602E11514a9482B061A941e',
    api: API
  },

  fantom: {
    address: '0xFee05C41195985909DDfc9127Db1f94559c46db3',
    api: API
  },

  avalanche: {
    address: '0xFee05C41195985909DDfc9127Db1f94559c46db3',
    api: API
  },

  gnosis: {
    address: '0xFee05C41195985909DDfc9127Db1f94559c46db3',
    api: API
  },

  arbitrum: {
    address: '0xA1cfbeeF344A52e18f748fd6a126f9426A40fbc7',
    api: API
  },

  optimism: {
    address: '0x8698E529E9867eEbcC68b4792daC627cd8870736',
    api: API
  },

  base: {
    address: '0x8B127D169D232D5F3ebE1C3D06CE343FD7C1AA11',
    api: API
  },

};

var routers = {... routers$1, ...solanaRouters};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/** Detect free variable `global` from Node.js. */

var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol = _root.Symbol;

var _Symbol = Symbol;

/** Built-in value references. */
_Symbol ? _Symbol.toStringTag : undefined;

/** Built-in value references. */
_Symbol ? _Symbol.toStringTag : undefined;

// lower blockchain cost is better
const getBlockchainCost = (blockchain) => {
  // in $USD
  switch(blockchain) {
    case 'solana':
      return 0.000125
    case 'gnosis':
      return 0.0090
    case 'base':
      return 0.0095
    case 'optimism':
      return 0.0096
    case 'polygon':
      return 0.011
    case 'fantom':
      return 0.05
    case 'avalanche':
      return 0.10
    case 'arbitrum':
      return 0.11
    case 'bsc':
      return 0.20
    case 'ethereum':
      return 10.0
    default:
      return 100
  }
};

const EXCHANGE_PROXIES = {
  'arbitrum': {
    [Blockchains.arbitrum.wrapped.address]: '0x7E655088214d0657251A51aDccE9109CFd23B5B5'
  },
  'avalanche': {
    [Blockchains.avalanche.wrapped.address]: '0x2d0a6275eaDa0d03226919ce6D93661E589B2d59'
  },
  'base': {
    [Blockchains.base.wrapped.address]: '0xD1711710843B125a6a01FfDF9b95fDc3064BeF7A'
  },
  'bsc': {
    [Blockchains.bsc.wrapped.address]: '0xeEb80d14abfB058AA78DE38813fe705c3e3b243E'
  },
  'ethereum': {
    [Blockchains.ethereum.wrapped.address]: '0x298f4980525594b3b982779cf74ba76819708D43'
  },
  'fantom': {
    [Blockchains.fantom.wrapped.address]: '0x2d0a6275eaDa0d03226919ce6D93661E589B2d59'
  },
  'gnosis': {
    [Blockchains.gnosis.wrapped.address]: '0x2d0a6275eaDa0d03226919ce6D93661E589B2d59'
  },
  'optimism': {
    [Blockchains.optimism.wrapped.address]: '0x69594057e2C0224deb1180c7a5Df9ec9d5B611B5'
  },
  'polygon': {
    [Blockchains.polygon.wrapped.address]: '0xaE59C9d3E055BdFAa583E169aA5Ebe395689476a'
  },
  'solana': {}
};

const getTransaction$2 = async({ paymentRoute })=> {

  const transaction = {
    blockchain: paymentRoute.blockchain,
    to: transactionAddress({ paymentRoute }),
    api: transactionApi({ paymentRoute }),
    method: transactionMethod({ paymentRoute }),
    params: await transactionParams({ paymentRoute }),
    value: transactionValue({ paymentRoute })
  };

  return transaction
};

const transactionAddress = ({ paymentRoute })=> {
  if(paymentRoute.directTransfer && !paymentRoute.fee) {
    if(paymentRoute.toToken.address == Blockchains[paymentRoute.blockchain].currency.address) {
      return paymentRoute.toAddress
    } else {
      return paymentRoute.toToken.address
    }
  } else {
    return routers$1[paymentRoute.blockchain].address
  }
};

const transactionApi = ({ paymentRoute })=> {
  if(paymentRoute.directTransfer && !paymentRoute.fee) {
    if(paymentRoute.toToken.address == Blockchains[paymentRoute.blockchain].currency.address) {
      return undefined
    } else {
      return Token[paymentRoute.blockchain].DEFAULT
    }
  } else {
    return routers$1[paymentRoute.blockchain].api
  }
};

const transactionMethod = ({ paymentRoute })=> {
  if(paymentRoute.directTransfer && !paymentRoute.fee) {
    if(paymentRoute.toToken.address == Blockchains[paymentRoute.blockchain].currency.address) {
      return undefined
    } else { // standard token transfer
      return 'transfer'
    }
  } else {
    return 'pay'
  }
};

const getExchangeType = ({ exchangeRoute, blockchain })=> {
  if( typeof exchangeRoute === 'undefined' ) { return 0 }
  if(exchangeRoute.exchange.name === 'uniswap_v3' || exchangeRoute.exchange[blockchain].router.address === Blockchains[blockchain].wrapped.address) {
    return 2 // push
  } else {
    return 1 // pull
  }
};

const getExchangeCallData = ({ exchangeTransaction })=>{
  const contract = new ethers.Contract(exchangeTransaction.to, exchangeTransaction.api);
  const method = exchangeTransaction.method;
  const params = exchangeTransaction.params;
  
  let contractMethod;
  let fragment;
  fragment = contract.interface.fragments.find((fragment) => {
    return(
      fragment.name == method &&
      (fragment.inputs && params && typeof(params) === 'object' ? fragment.inputs.length == Object.keys(params).length : true)
    )
  });
  let paramsToEncode;
  if(fragment.inputs.length === 1 && fragment.inputs[0].type === 'tuple') {
    contractMethod = method;
    paramsToEncode = [params[fragment.inputs[0].name]];
  } else {
    contractMethod = `${method}(${fragment.inputs.map((input)=>input.type).join(',')})`;
    paramsToEncode = fragment.inputs.map((input) => {
      if(input.type === 'tuple') {
        let tuple = {};
        input.components.forEach((component, index)=>{
          tuple[component.name] = params[input.name][index];
        });
        contractMethod = method;
        return tuple
      } else {
        return params[input.name]
      }
    });
  }
  return contract.interface.encodeFunctionData(contractMethod, paramsToEncode)
};

const transactionParams = async ({ paymentRoute })=> {
  if(paymentRoute.directTransfer && !paymentRoute.fee) {
    if(paymentRoute.toToken.address == Blockchains[paymentRoute.blockchain].currency.address) {
      return undefined
    } else { // standard token transfer
      return [paymentRoute.toAddress, paymentRoute.toAmount]
    }
  } else {
    const deadline = Math.ceil(new Date()/1000)+3600; // 1 hour
    const exchangeRoute = paymentRoute.exchangeRoutes[0];
    const exchangeType = getExchangeType({ exchangeRoute, blockchain: paymentRoute.blockchain });
    const exchangeTransaction = !exchangeRoute ? undefined : await exchangeRoute.getTransaction({
      account: routers$1[paymentRoute.blockchain].address,
      inputTokenPushed: exchangeType === 2
    });
    const exchangeCallData = !exchangeTransaction ? Blockchains[paymentRoute.blockchain].zero : getExchangeCallData({ exchangeTransaction });
    let exchangeAddress = Blockchains[paymentRoute.blockchain].zero;
    if (exchangeRoute) {
      if(
        paymentRoute.blockchain === 'bsc' &&
        exchangeRoute.exchange.name === 'pancakeswap_v3' &&
        paymentRoute.toToken.address === Blockchains[paymentRoute.blockchain].currency.address
      ) {
        // bsc pancakeswap_v3 requries smart router exchange address for converting and paying out BNB/NATIVE
        exchangeAddress = exchangeRoute.exchange[paymentRoute.blockchain].smartRouter.address;
      } else { // proxy exchange or exchange directly
        exchangeAddress = EXCHANGE_PROXIES[exchangeTransaction.blockchain][exchangeRoute.exchange[paymentRoute.blockchain].router.address] || exchangeRoute.exchange[paymentRoute.blockchain].router.address;
      }
    }
    return {
      payment: {
        amountIn: paymentRoute.fromAmount,
        paymentAmount: paymentRoute.toAmount,
        feeAmount: paymentRoute.feeAmount || 0,
        tokenInAddress: paymentRoute.fromToken.address,
        exchangeAddress,
        tokenOutAddress: paymentRoute.toToken.address,
        paymentReceiverAddress: paymentRoute.toAddress,
        feeReceiverAddress: paymentRoute.fee ? paymentRoute.fee.receiver : Blockchains[paymentRoute.blockchain].zero,
        exchangeType: exchangeType,
        receiverType: 0,
        exchangeCallData: exchangeCallData,
        receiverCallData: Blockchains[paymentRoute.blockchain].zero,
        deadline,
      }
    }
  }
};

const transactionValue = ({ paymentRoute })=> {
  if(paymentRoute.fromToken.address == Blockchains[paymentRoute.blockchain].currency.address) {
    if(!paymentRoute.directTransfer) {
      return paymentRoute.fromAmount.toString()
    } else { // direct payment
      return paymentRoute.toAmount.toString()
    }
  } else {
    return ethers.BigNumber.from('0').toString()
  }
};

let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base'];
supported.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base'];
supported.solana = ['solana'];

const getTransaction$1 = ({ paymentRoute, fee })=>{
  if(supported.evm.includes(paymentRoute.blockchain)) {
    return getTransaction$2({ paymentRoute, fee })
  } else if(supported.solana.includes(paymentRoute.blockchain)) {
    return getTransaction$3({ paymentRoute, fee })
  } else {
    throw('Blockchain not supported!')
  }
};

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

class PaymentRoute {
  constructor({
    blockchain,
    fromAddress,
    fromToken,
    fromAmount,
    fromDecimals,
    fromBalance,
    toToken,
    toAmount,
    toDecimals,
    toAddress,
    fee,
    feeAmount,
    exchangeRoutes,
    approvalRequired,
    currentAllowance,
    approvalTransaction,
    directTransfer,
  }) {
    this.blockchain = blockchain;
    this.fromAddress = fromAddress;
    this.fromToken = fromToken;
    this.fromAmount = _optionalChain([(fromAmount || toAmount), 'optionalAccess', _ => _.toString, 'call', _2 => _2()]);
    this.fromDecimals = fromDecimals;
    this.fromBalance = fromBalance;
    this.toToken = toToken;
    this.toAmount = _optionalChain([toAmount, 'optionalAccess', _3 => _3.toString, 'call', _4 => _4()]);
    this.toDecimals = toDecimals;
    this.toAddress = toAddress;
    this.fee = fee;
    this.feeAmount = feeAmount;
    this.exchangeRoutes = exchangeRoutes || [];
    this.currentAllowance = currentAllowance;
    this.approvalRequired = approvalRequired;
    this.approvalTransaction = approvalTransaction;
    this.directTransfer = directTransfer;
    this.getTransaction = async ()=> await getTransaction$1({ paymentRoute: this });
  }
}

function convertToRoutes({ assets, accept, from }) {
  return Promise.all(assets.map(async (asset)=>{
    let relevantConfigurations = accept.filter((configuration)=>(configuration.blockchain == asset.blockchain));
    let fromToken = new Token(asset);
    return Promise.all(relevantConfigurations.map(async (configuration)=>{
      if(configuration.token && configuration.amount) {
        let blockchain = configuration.blockchain;
        let fromDecimals = asset.decimals;
        let toToken = new Token({ blockchain, address: configuration.token });
        let toDecimals = await toToken.decimals();
        let toAmount = (await toToken.BigNumber(configuration.amount)).toString();

        return new PaymentRoute({
          blockchain,
          fromToken,
          fromDecimals,
          toToken,
          toAmount,
          toDecimals,
          fromBalance: asset.balance,
          fromAddress: from[configuration.blockchain],
          toAddress: configuration.toAddress,
          fee: configuration.fee,
        })
      } else if(configuration.fromToken && configuration.fromAmount && fromToken.address.toLowerCase() == configuration.fromToken.toLowerCase()) {
        let blockchain = configuration.blockchain;
        let fromAmount = (await fromToken.BigNumber(configuration.fromAmount)).toString();
        let fromDecimals = asset.decimals;
        let toToken = new Token({ blockchain, address: configuration.toToken });
        let toDecimals = await toToken.decimals();
        
        return new PaymentRoute({
          blockchain,
          fromToken,
          fromDecimals,
          fromAmount,
          toToken,
          toDecimals,
          fromBalance: asset.balance,
          fromAddress: from[configuration.blockchain],
          toAddress: configuration.toAddress,
          fee: configuration.fee,
        })
      }
    }))
  })).then((routes)=> routes.flat().filter(el => el))
}

function assetsToRoutes({ assets, blacklist, accept, from }) {
  return Promise.resolve(filterBlacklistedAssets({ assets, blacklist }))
    .then((assets) => convertToRoutes({ assets, accept, from }))
    .then((routes) => addDirectTransferStatus({ routes }))
    .then(addExchangeRoutes)
    .then(filterNotRoutable)
    .then(filterInsufficientBalance)
    .then((routes)=>addRouteAmounts({ routes }))
    .then(addApproval)
    .then(sortPaymentRoutes)
    .then(filterDuplicateFromTokens)
    .then((routes)=>routes.map((route)=>new PaymentRoute(route)))
}

function route({ accept, from, whitelist, blacklist, drip }) {
  if(accept.some((accept)=>{ return accept && accept.fee && typeof(accept.fee.amount) == 'string' && accept.fee.amount.match(/\.\d\d+\%/) })) {
    throw('Only up to 1 decimal is supported for fee amounts!')
  }

  return new Promise(async (resolveAll, rejectAll)=>{

    let priority = [];
    let blockchains = [];
    if(whitelist) {
      for (const blockchain in whitelist) {
        (whitelist[blockchain] || []).forEach((address)=>{
          blockchains.push(blockchain);
          priority.push({ blockchain, address });
        });
      }
    } else {
      accept.forEach((accepted)=>{
        blockchains.push(accepted.blockchain);
        priority.push({ blockchain: accepted.blockchain, address: accepted.token || accepted.toToken });
      });
    }

    // add native currency as priority if does not exist already
    [...new Set(blockchains)].forEach((blockchain)=>{
      if(!priority.find((priority)=>priority.blockchain === blockchain && priority.address === Blockchains[blockchain].currency.address)) {
        priority.push({ blockchain, address: Blockchains[blockchain].currency.address });
      }
    });

    priority.sort((a,b)=>{

      // cheaper blockchains are more cost efficient
      if (getBlockchainCost(a.blockchain) < getBlockchainCost(b.blockchain)) {
        return -1 // a wins
      }
      if (getBlockchainCost(b.blockchain) < getBlockchainCost(a.blockchain)) {
        return 1 // b wins
      }

      // NATIVE input token is more cost efficient
      if (a.address.toLowerCase() === Blockchains[a.blockchain].currency.address.toLowerCase()) {
        return -1 // a wins
      }
      if (b.address.toLowerCase() === Blockchains[b.blockchain].currency.address.toLowerCase()) {
        return 1 // b wins
      }

      return 0
    });

    const sortPriorities = (priorities, a,b)=>{
      if(!priorities || priorities.length === 0) { return 0 }
      let priorityIndexOfA = priorities.indexOf([a.blockchain, a.address.toLowerCase()].join(''));
      let priorityIndexOfB = priorities.indexOf([b.blockchain, b.address.toLowerCase()].join(''));
      
      if(priorityIndexOfA !== -1 && priorityIndexOfB === -1) {
        return -1 // a wins
      }
      if(priorityIndexOfB !== -1 && priorityIndexOfA === -1) {
        return 1 // b wins
      }

      if(priorityIndexOfA < priorityIndexOfB) {
        return -1 // a wins
      }
      if(priorityIndexOfB < priorityIndexOfA) {
        return 1 // b wins
      }
      return 0
    };

    let drippedIndex = 0;
    const dripQueue = [];
    const dripped = [];
    const priorities = priority.map((priority)=>[priority.blockchain, priority.address.toLowerCase()].join(''));
    const thresholdToFirstDripIfNo1PriorityWasNotFirst = 3000;
    const now = ()=>Math.ceil(new Date());
    const time = now();
    setTimeout(()=>{
      dripQueue.forEach((asset)=>dripRoute(route, false));
    }, thresholdToFirstDripIfNo1PriorityWasNotFirst);
    const dripRoute = (route, recursive = true)=>{
      try {
        const asset = { blockchain: route.blockchain, address: route.fromToken.address };
        const assetAsKey = [asset.blockchain, asset.address.toLowerCase()].join('');
        const timeThresholdReached = now()-time > thresholdToFirstDripIfNo1PriorityWasNotFirst;
        if(dripped.indexOf(assetAsKey) > -1) { return }
        if(priorities.indexOf(assetAsKey) === drippedIndex) {
          dripped.push(assetAsKey);
          drip(route);
          drippedIndex += 1;
          if(!recursive){ return }
          dripQueue.forEach((asset)=>dripRoute(route, false));
        } else if(drippedIndex >= priorities.length || timeThresholdReached) {
          if(priorities.indexOf(assetAsKey) === -1) {
            dripped.push(assetAsKey);
            drip(route);
          } else if (drippedIndex >= priorities.length || timeThresholdReached) {
            dripped.push(assetAsKey);
            drip(route);
          }
        } else if(!dripQueue.find((queued)=>queued.blockchain === asset.blockchain && queued.address.toLowerCase() === asset.address.toLowerCase())) {
          dripQueue.push(asset);
          dripQueue.sort((a,b)=>sortPriorities(priorities, a, b));
        }
      } catch (e) {}
    };

    const allAssets = await dripAssets({
      accounts: from,
      priority,
      only: whitelist,
      exclude: blacklist,
      drip: !drip ? undefined : (asset)=>{
        assetsToRoutes({ assets: [asset], blacklist, accept, from }).then((routes)=>{
          if(_optionalChain([routes, 'optionalAccess', _5 => _5.length])) {
            dripRoute(routes[0]);
          }
        });
      }
    });

    let allPaymentRoutes = (await assetsToRoutes({ assets: allAssets, blacklist, accept, from }) || []);
    allPaymentRoutes.assets = allAssets;
    resolveAll(allPaymentRoutes);
  })
}

let filterBlacklistedAssets = ({ assets, blacklist }) => {
  if(blacklist == undefined) {
    return assets
  } else {
    return assets.filter((asset)=> {
      if(blacklist[asset.blockchain] == undefined) {
        return true
      } else {
        return !blacklist[asset.blockchain].find((blacklistedAddress)=>{
          return blacklistedAddress.toLowerCase() == asset.address.toLowerCase()
        })
      }
    })
  }
};

let addExchangeRoutes = async (routes) => {
  return await Promise.all(
    routes.map((route) => {
      if(route.directTransfer) { return [] }
      if(route.toToken && route.toAmount) {
        return Exchanges.route({
          blockchain: route.blockchain,
          tokenIn: route.fromToken.address,
          tokenOut: route.toToken.address,
          amountOutMin: route.toAmount,
          fromAddress: route.fromAddress,
          toAddress: route.toAddress
        })
      } else if(route.fromToken && route.fromAmount) {
        return Exchanges.route({
          blockchain: route.blockchain,
          tokenIn: route.fromToken.address,
          tokenOut: route.toToken.address,
          amountIn: route.fromAmount,
          fromAddress: route.fromAddress,
          toAddress: route.toAddress
        })
      }
    }),
  ).then((exchangeRoutes) => {
    return routes.map((route, index) => {
      route.exchangeRoutes = exchangeRoutes[index];
      return route
    })
  })
};

let filterNotRoutable = (routes) => {
  return routes.filter((route) => {
    return (
      route.exchangeRoutes.length != 0 ||
      route.fromToken.address.toLowerCase() == route.toToken.address.toLowerCase() // direct transfer always possible
    )
  })
};

let filterInsufficientBalance = async(routes) => {
  return routes.filter((route) => {
    if (route.fromToken.address.toLowerCase() == route.toToken.address.toLowerCase()) {
      return ethers.BigNumber.from(route.fromBalance).gte(ethers.BigNumber.from(route.toAmount))
    } else if(route.fromAmount && route.toAmount) {
      return ethers.BigNumber.from(route.fromBalance).gte(ethers.BigNumber.from(route.exchangeRoutes[0].amountInMax))
    } else if(route.exchangeRoutes[0] && route.exchangeRoutes[0].amountIn) {
      return ethers.BigNumber.from(route.fromBalance).gte(ethers.BigNumber.from(route.exchangeRoutes[0].amountIn))
    }
  })
};

let addApproval = (routes) => {
  return Promise.all(routes.map(
    (route) => {
      if(route.blockchain === 'solana') {
        return Promise.resolve(Blockchains.solana.maxInt)
      } else {
        return route.fromToken.allowance(route.fromAddress, routers[route.blockchain].address).catch(()=>{})
      }
    }
  )).then(
    (allowances) => {
      routes.map((route, index) => {
        if(
          (
            allowances[index] === undefined ||
            route.directTransfer ||
            route.fromToken.address.toLowerCase() == Blockchains[route.blockchain].currency.address.toLowerCase() ||
            route.blockchain === 'solana'
          )
        ) {
          routes[index].approvalRequired = false;
        } else {
          routes[index].currentAllowance = ethers.BigNumber.from(allowances[index]);
          routes[index].approvalRequired = ethers.BigNumber.from(route.fromAmount).gte(ethers.BigNumber.from(allowances[index]));
          if(routes[index].approvalRequired) {
            routes[index].approvalTransaction = {
              blockchain: route.blockchain,
              to: route.fromToken.address,
              api: Token[route.blockchain].DEFAULT,
              method: 'approve',
              params: [routers[route.blockchain].address, Blockchains[route.blockchain].maxInt]
            };
          }
        }
      });
      return routes
    },
  )
};

let addDirectTransferStatus = ({ routes }) => {
  return routes.map((route)=>{
    if(supported.evm.includes(route.blockchain)) {
      route.directTransfer = route.fromToken.address.toLowerCase() == route.toToken.address.toLowerCase() && route.fee == undefined;
    } else if (route.blockchain === 'solana') {
      route.directTransfer = route.fromToken.address.toLowerCase() == route.toToken.address.toLowerCase();
    }
    return route
  })
};

let calculateAmounts = ({ paymentRoute, exchangeRoute })=>{
  let fromAmount;
  let toAmount;
  let feeAmount;
  if(exchangeRoute) {
    if(exchangeRoute && exchangeRoute.exchange.wrapper) {
      fromAmount = exchangeRoute.amountIn.toString();
      toAmount = subtractFee({ amount: exchangeRoute.amountOutMin.toString(), paymentRoute });
    } else {
      fromAmount = exchangeRoute.amountIn.toString();
      toAmount = subtractFee({ amount: exchangeRoute.amountOutMin.toString(), paymentRoute });
    }
  } else {
    fromAmount = paymentRoute.fromAmount;
    toAmount = subtractFee({ amount: paymentRoute.fromAmount, paymentRoute });
  }
  if(paymentRoute.fee){
    feeAmount = getFeeAmount({ paymentRoute });
  }
  return { fromAmount, toAmount, feeAmount }
};

let subtractFee = ({ amount, paymentRoute })=> {
  if(paymentRoute.fee) {
    let feeAmount = getFeeAmount({ paymentRoute });
    return ethers.BigNumber.from(amount).sub(feeAmount).toString()
  } else {
    return amount
  }
};

let getFeeAmount = ({ paymentRoute })=> {
  if(typeof paymentRoute.fee.amount == 'string' && paymentRoute.fee.amount.match('%')) {
    return ethers.BigNumber.from(paymentRoute.toAmount).mul(parseFloat(paymentRoute.fee.amount)*10).div(1000).toString()
  } else if(typeof paymentRoute.fee.amount == 'string') {
    return paymentRoute.fee.amount
  } else if(typeof paymentRoute.fee.amount == 'number') {
    return ethers.utils.parseUnits(paymentRoute.fee.amount.toString(), paymentRoute.toDecimals).toString()
  } else {
    throw('Unknown fee amount type!')
  }
};

let addRouteAmounts = ({ routes })=> {
  return routes.map((route)=>{

    if(supported.evm.includes(route.blockchain)) {

      if(route.directTransfer && !route.fee) {
        route.fromAmount = route.toAmount;
      } else {
        let { fromAmount, toAmount, feeAmount } = calculateAmounts({ paymentRoute: route, exchangeRoute: route.exchangeRoutes[0] });
        route.fromAmount = fromAmount;
        route.toAmount = toAmount;
        if(route.fee){
          route.feeAmount = feeAmount;
        }
      }
    } else if (supported.solana.includes(route.blockchain)) {

      let { fromAmount, toAmount, feeAmount } = calculateAmounts({ paymentRoute: route, exchangeRoute: route.exchangeRoutes[0] });
      route.fromAmount = fromAmount;
      route.toAmount = toAmount;
      if(route.fee){
        route.feeAmount = feeAmount;
      }

    }
    
    return route
  })
};

let filterDuplicateFromTokens = (routes) => {
  return routes.filter((routeA, indexA)=>{
    let otherMoreEfficientRoute = routes.find((routeB, indexB)=>{
      if(routeA.fromToken.address != routeB.fromToken.address) { return false }
      if(routeA.fromToken.blockchain != routeB.fromToken.blockchain) { return false }
      if(routeB.directTransfer && !routeA.directTransfer) { return true }
      if(ethers.BigNumber.from(routeB.fromAmount).lt(ethers.BigNumber.from(routeA.fromAmount)) && !routeA.directTransfer) { return true }
      if(routeB.fromAmount == routeA.fromAmount && indexB < indexA) { return true }
    });

    return otherMoreEfficientRoute == undefined
  })
};

let sortPaymentRoutes = (routes) => {
  let aWins = -1;
  let bWins = 1;
  return routes.sort((a, b) => {

    // cheaper blockchains are more cost-efficien
    if (getBlockchainCost(a.fromToken.blockchain) < getBlockchainCost(b.fromToken.blockchain)) {
      return aWins
    }
    if (getBlockchainCost(b.fromToken.blockchain) < getBlockchainCost(a.fromToken.blockchain)) {
      return bWins
    }

    // direct transfer is always more cost-efficient
    if (a.fromToken.address.toLowerCase() == a.toToken.address.toLowerCase()) {
      return aWins
    }
    if (b.fromToken.address.toLowerCase() == b.toToken.address.toLowerCase()) {
      return bWins
    }

    // requiring approval is less cost efficient
    if (a.approvalRequired && !b.approvalRequired) {
      return bWins
    }
    if (b.approvalRequired && !a.approvalRequired) {
      return aWins
    }

    // NATIVE -> WRAPPED is more cost efficient that swapping to another token
    if (JSON.stringify([a.fromToken.address.toLowerCase(), a.toToken.address.toLowerCase()].sort()) == JSON.stringify([Blockchains[a.blockchain].currency.address.toLowerCase(), Blockchains[a.blockchain].wrapped.address.toLowerCase()].sort())) {
      return aWins
    }
    if (JSON.stringify([b.fromToken.address.toLowerCase(), b.toToken.address.toLowerCase()].sort()) == JSON.stringify([Blockchains[b.blockchain].currency.address.toLowerCase(), Blockchains[b.blockchain].wrapped.address.toLowerCase()].sort())) {
      return bWins
    }

    // NATIVE input token is more cost efficient
    if (a.fromToken.address.toLowerCase() == Blockchains[a.blockchain].currency.address.toLowerCase()) {
      return aWins
    }
    if (b.fromToken.address.toLowerCase() == Blockchains[b.blockchain].currency.address.toLowerCase()) {
      return bWins
    }

    if (a.fromToken.address < b.fromToken.address) {
      return aWins
    } else {
      return bWins
    }
  })
};

const getTransaction = (paymentRoute)=>{
  if(paymentRoute.blockchain === 'solana') {
    return getTransaction$3({ paymentRoute })
  }
};

export { getTransaction, route, routers };
