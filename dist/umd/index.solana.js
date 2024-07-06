(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@depay/web3-blockchains'), require('@depay/solana-web3.js'), require('ethers'), require('@depay/web3-assets-solana'), require('@depay/web3-exchanges-solana'), require('@depay/web3-tokens-solana')) :
  typeof define === 'function' && define.amd ? define(['exports', '@depay/web3-blockchains', '@depay/solana-web3.js', 'ethers', '@depay/web3-assets-solana', '@depay/web3-exchanges-solana', '@depay/web3-tokens-solana'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Payments = {}, global.Web3Blockchains, global.SolanaWeb3js, global.ethers, global.Web3Assets, global.Web3Exchanges, global.Web3Tokens));
})(this, (function (exports, Blockchains, solanaWeb3_js, ethers, web3AssetsSolana, Exchanges, Token$1) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Blockchains__default = /*#__PURE__*/_interopDefaultLegacy(Blockchains);
  var Exchanges__default = /*#__PURE__*/_interopDefaultLegacy(Exchanges);
  var Token__default = /*#__PURE__*/_interopDefaultLegacy(Token$1);

  var routers$1 = {
    solana: {
      address: 'DePayRG7ZySPWzeK9Kvq7aPeif7sdbBZNh6DHcvNj7F7',
      ammProgram: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
      alt: 'EYGgx5fYCZtLN2pvnR4Bhn5KpMffKwyHCms4VhjSvF2K',
      api: {
        createPaymentsAccount: {
          anchorDiscriminator: new solanaWeb3_js.BN("8445995362644372894"),
          layout: solanaWeb3_js.struct([
            solanaWeb3_js.u64("anchorDiscriminator"),
          ])
        },
        createEscrowSolAccount: {
          anchorDiscriminator: new solanaWeb3_js.BN("2482112285991870004"),
          layout: solanaWeb3_js.struct([
            solanaWeb3_js.u64("anchorDiscriminator"),
          ])
        },
        createEscrowTokenAccount: {
          anchorDiscriminator: new solanaWeb3_js.BN("16156440424245087"),
          layout: solanaWeb3_js.struct([
            solanaWeb3_js.u64("anchorDiscriminator"),
          ])
        },
        routeSol: {
          anchorDiscriminator: new solanaWeb3_js.BN("6497164560834983274"),
          layout: solanaWeb3_js.struct([
            solanaWeb3_js.u64("anchorDiscriminator"),
            solanaWeb3_js.u64("nonce"),
            solanaWeb3_js.u64("paymentAmount"),
            solanaWeb3_js.u64("feeAmount"),
            solanaWeb3_js.i64("deadline"),
          ])
        },
        routeToken: {
          anchorDiscriminator: new solanaWeb3_js.BN("13483873682232752277"),
          layout: solanaWeb3_js.struct([
            solanaWeb3_js.u64("anchorDiscriminator"),
            solanaWeb3_js.u64("nonce"),
            solanaWeb3_js.u64("paymentAmount"),
            solanaWeb3_js.u64("feeAmount"),
            solanaWeb3_js.i64("deadline"),
          ])
        },
        routeOrcaSwap: {
          anchorDiscriminator: new solanaWeb3_js.BN("9797248061404332986"),
          layout: solanaWeb3_js.struct([
            solanaWeb3_js.u64("anchorDiscriminator"),
            solanaWeb3_js.u64("nonce"),
            solanaWeb3_js.u64("amountIn"),
            solanaWeb3_js.u128("sqrtPriceLimit"),
            solanaWeb3_js.bool("amountSpecifiedIsInput"),
            solanaWeb3_js.bool("aToB"),
            solanaWeb3_js.u64("paymentAmount"),
            solanaWeb3_js.u64("feeAmount"),
            solanaWeb3_js.i64("deadline"),
          ])
        },
        routeOrcaSwapSolOut: {
          anchorDiscriminator: new solanaWeb3_js.BN("13662217913752830165"),
          layout: solanaWeb3_js.struct([
            solanaWeb3_js.u64("anchorDiscriminator"),
            solanaWeb3_js.u64("nonce"),
            solanaWeb3_js.u64("amountIn"),
            solanaWeb3_js.u128("sqrtPriceLimit"),
            solanaWeb3_js.bool("amountSpecifiedIsInput"),
            solanaWeb3_js.bool("aToB"),
            solanaWeb3_js.u64("paymentAmount"),
            solanaWeb3_js.u64("feeAmount"),
            solanaWeb3_js.i64("deadline"),
          ])
        },
        routeOrcaTwoHopSwap: {
          anchorDiscriminator: new solanaWeb3_js.BN("15695720599845325801"),
          layout: solanaWeb3_js.struct([
            solanaWeb3_js.u64("anchorDiscriminator"),
            solanaWeb3_js.u64("nonce"),
            solanaWeb3_js.u64("amountIn"),
            solanaWeb3_js.bool("amountSpecifiedIsInput"),
            solanaWeb3_js.bool("aToBOne"),
            solanaWeb3_js.bool("aToBTwo"),
            solanaWeb3_js.u128("sqrtPriceLimitOne"),
            solanaWeb3_js.u128("sqrtPriceLimitTwo"),
            solanaWeb3_js.u64("paymentAmount"),
            solanaWeb3_js.u64("feeAmount"),
            solanaWeb3_js.i64("deadline"),
          ])
        },
        routeOrcaTwoHopSwapSolOut: {
          anchorDiscriminator: new solanaWeb3_js.BN("15074061855608091530"),
          layout: solanaWeb3_js.struct([
            solanaWeb3_js.u64("anchorDiscriminator"),
            solanaWeb3_js.u64("nonce"),
            solanaWeb3_js.u64("amountIn"),
            solanaWeb3_js.bool("amountSpecifiedIsInput"),
            solanaWeb3_js.bool("aToBOne"),
            solanaWeb3_js.bool("aToBTwo"),
            solanaWeb3_js.u128("sqrtPriceLimitOne"),
            solanaWeb3_js.u128("sqrtPriceLimitTwo"),
            solanaWeb3_js.u64("paymentAmount"),
            solanaWeb3_js.u64("feeAmount"),
            solanaWeb3_js.i64("deadline"),
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

  function _optionalChain$3$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  const BATCH_INTERVAL$1 = 10;
  const CHUNK_SIZE$1 = 99;
  const MAX_RETRY$1 = 3;

  class StaticJsonRpcBatchProvider extends ethers.ethers.providers.JsonRpcProvider {

    constructor(url, network, endpoints, failover) {
      super(url);
      this._network = network;
      this._endpoint = url;
      this._endpoints = endpoints;
      this._failover = failover;
      this._pendingBatch = [];
    }

    detectNetwork() {
      return Promise.resolve(Blockchains__default["default"].findByName(this._network).id)
    }

    requestChunk(chunk, endpoint, attempt) {

      try {

        const request = chunk.map((inflight) => inflight.request);
        return ethers.ethers.utils.fetchJson(endpoint, JSON.stringify(request))
          .then((result) => {
            // For each result, feed it to the correct Promise, depending
            // on whether it was a success or error
            chunk.forEach((inflightRequest, index) => {
              const payload = result[index];
              if (_optionalChain$3$1([payload, 'optionalAccess', _ => _.error])) {
                const error = new Error(payload.error.message);
                error.code = payload.error.code;
                error.data = payload.error.data;
                inflightRequest.reject(error);
              } else if(_optionalChain$3$1([payload, 'optionalAccess', _2 => _2.result])) {
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
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            referrer: "",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ method: 'net_version', id: 1, jsonrpc: '2.0' })
          });
          if(!response.ok) { return resolve(999) }
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
      await setProviderEndpoints$2(blockchain, Blockchains__default["default"][blockchain].endpoints);
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
      await setProviderEndpoints$2(blockchain, Blockchains__default["default"][blockchain].endpoints);
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

  function _optionalChain$2$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  const BATCH_INTERVAL = 10;
  const CHUNK_SIZE = 99;
  const MAX_RETRY = 3;

  class StaticJsonRpcSequentialProvider extends solanaWeb3_js.Connection {

    constructor(url, network, endpoints, failover) {
      super(url);
      this._provider = new solanaWeb3_js.Connection(url);
      this._network = network;
      this._endpoint = url;
      this._endpoints = endpoints;
      this._failover = failover;
      this._pendingBatch = [];
      this._rpcRequest = this._rpcRequestReplacement.bind(this);
    }

    handleError(error, attempt, chunk) {
      if(attempt < MAX_RETRY && error && [
        'Failed to fetch', 'limit reached', '504', '503', '502', '500', '429', '426', '422', '413', '409', '408', '406', '405', '404', '403', '402', '401', '400'
      ].some((errorType)=>error.toString().match(errorType))) {
        const index = this._endpoints.indexOf(this._endpoint)+1;
        this._endpoint = index >= this._endpoints.length ? this._endpoints[0] : this._endpoints[index];
        this._provider = new solanaWeb3_js.Connection(this._endpoint);
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
              resolve(parsedJson);
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
              if (_optionalChain$2$1([payload, 'optionalAccess', _ => _.error])) {
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
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            referrer: "",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ method: 'getIdentity', id: 1, jsonrpc: '2.0' })
          });
          if(!response.ok) { return resolve(999) }
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
      await setProviderEndpoints$1(blockchain, Blockchains__default["default"][blockchain].endpoints);
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
      await setProviderEndpoints$1(blockchain, Blockchains__default["default"][blockchain].endpoints);
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

  let supported$2 = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base'];
  supported$2.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base'];
  supported$2.solana = ['solana'];

  function _optionalChain$1$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
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
    if (_optionalChain$1$1([cachedEntry, 'optionalAccess', _ => _.expiresAt]) > Date.now()) {
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

    if(supported$2.evm.includes(blockchain)) {


      return await EVM.getProvider(blockchain)


    } else if(supported$2.solana.includes(blockchain)) {


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
    const contract = new ethers.ethers.Contract(address, api, provider);
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
    const info = await provider.getAccountInfo(new solanaWeb3_js.PublicKey(address));
    if(!info || !info.data) { return }
    return api.decode(info.data)
  };

  const balance = ({ address, provider }) => {
    return provider.getBalance(new solanaWeb3_js.PublicKey(address))
  };

  const singleRequest = async({ blockchain, address, api, method, params, block, provider, providers })=> {

    try {

      if(method == undefined || method === 'getAccountInfo') {
        if(api == undefined) {
          api = solanaWeb3_js.ACCOUNT_LAYOUT; 
        }
        return await accountInfo({ address, api, method, params, provider, block })
      } else if(method === 'getProgramAccounts') {
        return await provider.getProgramAccounts(new solanaWeb3_js.PublicKey(address), params).then((accounts)=>{
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
        return await provider.getTokenAccountBalance(new solanaWeb3_js.PublicKey(address))
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
        if(supported$2.evm.includes(blockchain)) {


          return await requestEVM({ blockchain, address, api, method, params, block, strategy, timeout })


        } else if(supported$2.solana.includes(blockchain)) {


          return await requestSolana({ blockchain, address, api, method, params, block, strategy, timeout })


        } else {
          throw 'Unknown blockchain: ' + blockchain
        }  
      }
    })
  };

  var allowanceOnEVM = ({ blockchain, address, api, owner, spender })=>{
    return request(
      {
        blockchain,
        address,
        api,
        method: 'allowance',
        params: [owner, spender],
        cache: 5000, // 5 seconds
      },
    )
  };

  var balanceOnEVM = async ({ blockchain, address, account, api, id })=>{
    if (address == Blockchains__default["default"][blockchain].currency.address) {
      return await request(
        {
          blockchain: blockchain,
          address: account,
          method: 'balance',
          cache: 10000, // 10 seconds
        },
      )
    } else {
      return await request(
        {
          blockchain: blockchain,
          address: address,
          method: 'balanceOf',
          api,
          params: id ? [account, id] : [account],
          cache: 10000, // 10 seconds
        },
      )
    }
  };

  var decimalsOnEVM = ({ blockchain, address, api })=>{
    return request({
      blockchain,
      address,
      api,
      method: 'decimals',
      cache: 86400000, // 1 day
    })
  };

  var ERC1155 = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        }
      ],
      "name": "TransferBatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "TransferSingle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "URI",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "accounts",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeBatchTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "uri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  var ERC20 = [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [{ name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_spender', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_from', type: 'address' },
        { name: '_to', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{ name: '', type: 'uint8' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: 'balance', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [{ name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_to', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: '_owner', type: 'address' },
        { name: '_spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    { payable: true, stateMutability: 'payable', type: 'fallback' },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'owner', type: 'address' },
        { indexed: true, name: 'spender', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'from', type: 'address' },
        { indexed: true, name: 'to', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Transfer',
      type: 'event',
    },
  ];

  var WETH = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "guy",
          "type": "address"
        },
        {
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "src",
          "type": "address"
        },
        {
          "name": "dst",
          "type": "address"
        },
        {
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "dst",
          "type": "address"
        },
        {
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "src",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "guy",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "src",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "dst",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "dst",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "src",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "Withdrawal",
      "type": "event"
    }
  ];

  const uriAPI = [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];

  const uriToName = (tokenURI)=>{
    return new Promise((resolve)=>{
      if(tokenURI.match(/^ipfs/)) {
        tokenURI = `https://ipfs.io/ipfs/${tokenURI.split('://')[1]}`;
      }
      fetch(tokenURI).then((response) => {
        if (response.ok) { return response.json() }
        resolve();
      })
      .then((responseJson) => {
        if(responseJson) {
          let name = responseJson.name;
          if(name){
            resolve(name);
          } else {
            resolve();
          }
        }
      }).catch(()=>resolve());
    })
  };

  var nameOnEVM = ({ blockchain, address, api, id })=>{

    if(id) {
      return new Promise((resolve)=>{
        request({ blockchain, address, api: uriAPI, method: 'uri', params: [id] }).then((uri)=>{
          uri = uri.match('0x{id}') ? uri.replace('0x{id}', id) : uri;
          uriToName(uri).then(resolve);
        }).catch((error)=>{
          console.log('error', error);
          resolve();
        });
      })
    } else {
      return request(
        {
          blockchain: blockchain,
          address: address,
          api,
          method: 'name',
          cache: 86400000, // 1 day
        },
      )
    }
  };

  var symbolOnEVM = ({ blockchain, address, api })=>{
    return request(
      {
        blockchain,
        address,
        api,
        method: 'symbol',
        cache: 86400000, // 1 day
      }
    )
  };

  const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
  const ASSOCIATED_TOKEN_PROGRAM = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';

  function _optionalChain$4(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  var findProgramAddress = async ({ token, owner })=>{

    const [address] = await solanaWeb3_js.PublicKey.findProgramAddress(
      [
        (new solanaWeb3_js.PublicKey(owner)).toBuffer(),
        (new solanaWeb3_js.PublicKey(TOKEN_PROGRAM)).toBuffer(),
        (new solanaWeb3_js.PublicKey(token)).toBuffer()
      ],
      new solanaWeb3_js.PublicKey(ASSOCIATED_TOKEN_PROGRAM)
    );

    return _optionalChain$4([address, 'optionalAccess', _ => _.toString, 'call', _2 => _2()])
  };

  const MINT_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.u32('mintAuthorityOption'),
    solanaWeb3_js.publicKey('mintAuthority'),
    solanaWeb3_js.u64('supply'),
    solanaWeb3_js.u8('decimals'),
    solanaWeb3_js.bool('isInitialized'),
    solanaWeb3_js.u32('freezeAuthorityOption'),
    solanaWeb3_js.publicKey('freezeAuthority')
  ]);

  const KEY_LAYOUT = solanaWeb3_js.rustEnum([
    solanaWeb3_js.struct([], 'uninitialized'),
    solanaWeb3_js.struct([], 'editionV1'),
    solanaWeb3_js.struct([], 'masterEditionV1'),
    solanaWeb3_js.struct([], 'reservationListV1'),
    solanaWeb3_js.struct([], 'metadataV1'),
    solanaWeb3_js.struct([], 'reservationListV2'),
    solanaWeb3_js.struct([], 'masterEditionV2'),
    solanaWeb3_js.struct([], 'editionMarker'),
  ]);

  const CREATOR_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.publicKey('address'),
    solanaWeb3_js.bool('verified'),
    solanaWeb3_js.u8('share'),
  ]);

  const DATA_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.str('name'),
    solanaWeb3_js.str('symbol'),
    solanaWeb3_js.str('uri'),
    solanaWeb3_js.u16('sellerFeeBasisPoints'),
    solanaWeb3_js.option(
      solanaWeb3_js.vec(
        CREATOR_LAYOUT.replicate('creators')
      ),
      'creators'
    )
  ]);

  const METADATA_LAYOUT = solanaWeb3_js.struct([
    KEY_LAYOUT.replicate('key'),
    solanaWeb3_js.publicKey('updateAuthority'),
    solanaWeb3_js.publicKey('mint'),
    DATA_LAYOUT.replicate('data'),
    solanaWeb3_js.bool('primarySaleHappened'),
    solanaWeb3_js.bool('isMutable'),
    solanaWeb3_js.option(solanaWeb3_js.u8(), 'editionNonce'),
  ]);

  const TRANSFER_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.u8('instruction'),
    solanaWeb3_js.u64('amount'),
  ]);

  const TOKEN_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.publicKey('mint'),
    solanaWeb3_js.publicKey('owner'),
    solanaWeb3_js.u64('amount'),
    solanaWeb3_js.u32('delegateOption'),
    solanaWeb3_js.publicKey('delegate'),
    solanaWeb3_js.u8('state'),
    solanaWeb3_js.u32('isNativeOption'),
    solanaWeb3_js.u64('isNative'),
    solanaWeb3_js.u64('delegatedAmount'),
    solanaWeb3_js.u32('closeAuthorityOption'),
    solanaWeb3_js.publicKey('closeAuthority')
  ]);

  const INITIALIZE_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.u8('instruction'),
    solanaWeb3_js.publicKey('owner')
  ]);

  const CLOSE_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.u8('instruction')
  ]);

  const createTransferInstruction = async ({ token, amount, from, to })=>{

    let fromTokenAccount = await findProgramAddress({ token, owner: from });
    let toTokenAccount = await findProgramAddress({ token, owner: to });

    const keys = [
      { pubkey: new solanaWeb3_js.PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(toTokenAccount), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(from), isSigner: true, isWritable: false }
    ];

    const data = solanaWeb3_js.Buffer.alloc(TRANSFER_LAYOUT.span);
    TRANSFER_LAYOUT.encode({
      instruction: 3, // TRANSFER
      amount: new solanaWeb3_js.BN(amount)
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({ 
      keys,
      programId: new solanaWeb3_js.PublicKey(TOKEN_PROGRAM),
      data 
    })
  };

  const createAssociatedTokenAccountInstruction = async ({ token, owner, payer }) => {

    let associatedToken = await findProgramAddress({ token, owner });

    const keys = [
      { pubkey: new solanaWeb3_js.PublicKey(payer), isSigner: true, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(associatedToken), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(owner), isSigner: false, isWritable: false },
      { pubkey: new solanaWeb3_js.PublicKey(token), isSigner: false, isWritable: false },
      { pubkey: solanaWeb3_js.SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: new solanaWeb3_js.PublicKey(TOKEN_PROGRAM), isSigner: false, isWritable: false },
    ];

   return new solanaWeb3_js.TransactionInstruction({
      keys,
      programId: new solanaWeb3_js.PublicKey(ASSOCIATED_TOKEN_PROGRAM),
      data: solanaWeb3_js.Buffer.alloc(0)
    })
  };

  const initializeAccountInstruction = ({ account, token, owner })=>{

    const keys = [
      { pubkey: new solanaWeb3_js.PublicKey(account), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(token), isSigner: false, isWritable: false },
    ];

    const data = solanaWeb3_js.Buffer.alloc(INITIALIZE_LAYOUT.span);
    INITIALIZE_LAYOUT.encode({
      instruction: 18, // InitializeAccount3
      owner: new solanaWeb3_js.PublicKey(owner)
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({ keys, programId: new solanaWeb3_js.PublicKey(TOKEN_PROGRAM), data })
  };


  const closeAccountInstruction = ({ account, owner })=>{

    const keys = [
      { pubkey: new solanaWeb3_js.PublicKey(account), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(owner), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(owner), isSigner: true, isWritable: false }
    ];

    const data = solanaWeb3_js.Buffer.alloc(CLOSE_LAYOUT.span);
    CLOSE_LAYOUT.encode({
      instruction: 9 // CloseAccount
    }, data);

    return new solanaWeb3_js.TransactionInstruction({ keys, programId: new solanaWeb3_js.PublicKey(TOKEN_PROGRAM), data })
  };

  var instructions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createTransferInstruction: createTransferInstruction,
    createAssociatedTokenAccountInstruction: createAssociatedTokenAccountInstruction,
    initializeAccountInstruction: initializeAccountInstruction,
    closeAccountInstruction: closeAccountInstruction
  });

  var balanceOnSolana = async ({ blockchain, address, account, api })=>{

    if(address == Blockchains__default["default"][blockchain].currency.address) {

       return ethers.ethers.BigNumber.from(await request(`solana://${account}/balance`))

    } else {

      const tokenAccountAddress = await findProgramAddress({ token: address, owner: account });

      const balance = await request(`solana://${tokenAccountAddress}/getTokenAccountBalance`);

      if (balance) {
        return ethers.ethers.BigNumber.from(balance.value.amount)
      } else {
        return ethers.ethers.BigNumber.from('0')
      }
    }
  };

  var decimalsOnSolana = async ({ blockchain, address })=>{
    let data = await request({ blockchain, address, api: MINT_LAYOUT });
    return data.decimals
  };

  var findAccount = async ({ token, owner })=>{

    const address = await findProgramAddress({ token, owner });

    const existingAccount = await request({
      blockchain: 'solana',
      address,
      api: TOKEN_LAYOUT,
      cache: 1000 // 1s
    });

    return existingAccount
  };

  function _optionalChain$3(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  const METADATA_ACCOUNT = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

  const METADATA_REPLACE = new RegExp('\u0000', 'g');

  const getMetaDataPDA = async ({ metaDataPublicKey, mintPublicKey }) => {
    let seed = [
      solanaWeb3_js.Buffer.from('metadata'),
      metaDataPublicKey.toBuffer(),
      mintPublicKey.toBuffer()  
    ];

    return (await solanaWeb3_js.PublicKey.findProgramAddress(seed, metaDataPublicKey))[0]
  };

  const getMetaData = async ({ blockchain, address })=> {

    let mintPublicKey = new solanaWeb3_js.PublicKey(address);
    let metaDataPublicKey = new solanaWeb3_js.PublicKey(METADATA_ACCOUNT);
    let tokenMetaDataPublicKey = await getMetaDataPDA({ metaDataPublicKey, mintPublicKey });

    let metaData = await request({
      blockchain, 
      address: tokenMetaDataPublicKey.toString(),
      api: METADATA_LAYOUT,
      cache: 86400000, // 1 day
    });

    return {
      name: _optionalChain$3([metaData, 'optionalAccess', _ => _.data, 'optionalAccess', _2 => _2.name, 'optionalAccess', _3 => _3.replace, 'call', _4 => _4(METADATA_REPLACE, '')]),
      symbol: _optionalChain$3([metaData, 'optionalAccess', _5 => _5.data, 'optionalAccess', _6 => _6.symbol, 'optionalAccess', _7 => _7.replace, 'call', _8 => _8(METADATA_REPLACE, '')])
    }
  };

  function _optionalChain$2(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  var nameOnSolana = async ({ blockchain, address })=>{
    let metaData = await getMetaData({ blockchain, address });
    return _optionalChain$2([metaData, 'optionalAccess', _ => _.name])
  };

  function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  var symbolOnSolana = async ({ blockchain, address })=>{
    let metaData = await getMetaData({ blockchain, address });
    return _optionalChain$1([metaData, 'optionalAccess', _ => _.symbol])
  };

  let supported$1 = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base'];
  supported$1.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'arbitrum', 'avalanche', 'gnosis', 'optimism', 'base'];
  supported$1.solana = ['solana'];

  function _optionalChain$5(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

  class Token {
    
    constructor({ blockchain, address }) {
      this.blockchain = blockchain;
      if(supported$1.evm.includes(this.blockchain)) {
        this.address = ethers.ethers.utils.getAddress(address);
      } else if(supported$1.solana.includes(this.blockchain)) {
        this.address = address;
      }
    }

    async decimals() {
      if (this.address == Blockchains__default["default"].findByName(this.blockchain).currency.address) {
        return Blockchains__default["default"].findByName(this.blockchain).currency.decimals
      }
      let decimals;
      try {
        if(supported$1.evm.includes(this.blockchain)) {

          decimals = await decimalsOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT });

        } else if(supported$1.solana.includes(this.blockchain)) {

          decimals = await decimalsOnSolana({ blockchain: this.blockchain, address: this.address });

          
        }
      } catch (e) {}
      return decimals
    }

    async symbol() {
      if (this.address == Blockchains__default["default"].findByName(this.blockchain).currency.address) {
        return Blockchains__default["default"].findByName(this.blockchain).currency.symbol
      }
      if(supported$1.evm.includes(this.blockchain)) {

        return await symbolOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })

      } else if(supported$1.solana.includes(this.blockchain)) {

        return await symbolOnSolana({ blockchain: this.blockchain, address: this.address })

      }
    }

    async name(args) {
      if (this.address == Blockchains__default["default"].findByName(this.blockchain).currency.address) {
        return Blockchains__default["default"].findByName(this.blockchain).currency.name
      }
      if(supported$1.evm.includes(this.blockchain)) {

        return await nameOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, id: _optionalChain$5([args, 'optionalAccess', _ => _.id]) })

      } else if(supported$1.solana.includes(this.blockchain)) {

        return await nameOnSolana({ blockchain: this.blockchain, address: this.address })

      }
    }

    async balance(account, id) {
      if(supported$1.evm.includes(this.blockchain)) {

        return await balanceOnEVM({ blockchain: this.blockchain, account, address: this.address, api: id ? Token[this.blockchain][1155] : Token[this.blockchain].DEFAULT, id })

      } else if(supported$1.solana.includes(this.blockchain)) {

        return await balanceOnSolana({ blockchain: this.blockchain, account, address: this.address, api: Token[this.blockchain].DEFAULT })

      }
    }

    async allowance(owner, spender) {
      if (this.address == Blockchains__default["default"].findByName(this.blockchain).currency.address) {
        return ethers.ethers.BigNumber.from(Blockchains__default["default"].findByName(this.blockchain).maxInt)
      }
      if(supported$1.evm.includes(this.blockchain)) {

        return await allowanceOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, owner, spender })

      } else if(supported$1.solana.includes(this.blockchain)) {
        return ethers.ethers.BigNumber.from(Blockchains__default["default"].findByName(this.blockchain).maxInt)
      } 
    }

    async BigNumber(amount) {
      let decimals = await this.decimals();
      return ethers.ethers.utils.parseUnits(
        Token.safeAmount({ amount: parseFloat(amount), decimals }).toString(),
        decimals
      )
    }

    async readable(amount) {
      let decimals = await this.decimals();
      let readable = ethers.ethers.utils.formatUnits(amount.toString(), decimals);
      readable = readable.replace(/\.0+$/, '');
      return readable
    }
  }

  Token.BigNumber = async ({ amount, blockchain, address }) => {
    let token = new Token({ blockchain, address });
    return token.BigNumber(amount)
  };

  Token.readable = async ({ amount, blockchain, address }) => {
    let token = new Token({ blockchain, address });
    return token.readable(amount)
  };

  Token.safeAmount = ({ amount, decimals }) => {
    return parseFloat(amount.toFixed(decimals))
  };


  Token.ethereum = { 
    DEFAULT: ERC20,
    ERC20: ERC20,
    20: ERC20,
    1155: ERC1155,
    WRAPPED: WETH,
  };

  Token.bsc = { 
    DEFAULT: ERC20,
    BEP20: ERC20,
    20: ERC20,
    1155: ERC1155,
    WRAPPED: WETH,
  };

  Token.polygon = { 
    DEFAULT: ERC20,
    ERC20: ERC20,
    20: ERC20,
    1155: ERC1155,
    WRAPPED: WETH,
  };

  Token.fantom = {
    DEFAULT: ERC20,
    FTM20: ERC20,
    20: ERC20,
    1155: ERC1155,
    WRAPPED: WETH,
  };

  Token.arbitrum = {
    DEFAULT: ERC20,
    ERC20: ERC20,
    20: ERC20,
    1155: ERC1155,
    WRAPPED: WETH,
  };

  Token.avalanche = {
    DEFAULT: ERC20,
    ERC20: ERC20,
    ARC20: ERC20,
    20: ERC20,
    1155: ERC1155,
    WRAPPED: WETH,
  };

  Token.gnosis = {
    DEFAULT: ERC20,
    ERC20: ERC20,
    20: ERC20,
    1155: ERC1155,
    WRAPPED: WETH,
  };

  Token.optimism = {
    DEFAULT: ERC20,
    ERC20: ERC20,
    20: ERC20,
    1155: ERC1155,
    WRAPPED: WETH,
  };

  Token.base = {
    DEFAULT: ERC20,
    ERC20: ERC20,
    20: ERC20,
    1155: ERC1155,
    WRAPPED: WETH,
  };

  Token.solana = {
    MINT_LAYOUT,
    METADATA_LAYOUT,
    TRANSFER_LAYOUT,
    METADATA_ACCOUNT,
    TOKEN_PROGRAM,
    TOKEN_LAYOUT,
    ASSOCIATED_TOKEN_PROGRAM,
    findProgramAddress,
    findAccount,
    getMetaData,
    getMetaDataPDA,
    ...instructions
  };

  const getWSolSenderAccountKeypairIfNeeded = async ({ paymentRoute })=> {

    if(
      paymentRoute.fromToken.address === Blockchains__default["default"].solana.currency.address &&
      paymentRoute.toToken.address !== Blockchains__default["default"].solana.currency.address
    ){
      return solanaWeb3_js.Keypair.generate()
    }
  };

  const getWSolEscrowAccountKeypairIfNeeded = async ({ paymentRoute })=> {

    if(
      paymentRoute.fromToken.address !== Blockchains__default["default"].solana.currency.address &&
      paymentRoute.toToken.address === Blockchains__default["default"].solana.currency.address
    ){
      return solanaWeb3_js.Keypair.generate()
    }
  };

  const createWSolSenderAccount = async ({ wSolSenderAccountKeypair, paymentRoute })=>{

    if(!wSolSenderAccountKeypair) {
      return
    }

    const wSolStartAmount = paymentRoute.fromToken.address === Blockchains__default["default"].solana.currency.address ? new solanaWeb3_js.BN(paymentRoute.fromAmount) : new solanaWeb3_js.BN('0');
    const provider = await getProvider('solana');
    const rent = new solanaWeb3_js.BN(await provider.getMinimumBalanceForRentExemption(Token.solana.TOKEN_LAYOUT.span));
    const owner = paymentRoute.fromAddress;
    const lamports = wSolStartAmount.add(rent);

    const createAccountInstruction = solanaWeb3_js.SystemProgram.createAccount({
      fromPubkey: new solanaWeb3_js.PublicKey(owner),
      newAccountPubkey: wSolSenderAccountKeypair.publicKey,
      programId: new solanaWeb3_js.PublicKey(Token.solana.TOKEN_PROGRAM),
      space: Token.solana.TOKEN_LAYOUT.span,
      lamports
    });

    const initializeAccountInstruction = Token.solana.initializeAccountInstruction({
      account: wSolSenderAccountKeypair.publicKey.toString(),
      token: Blockchains__default["default"].solana.wrapped.address,
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
    const rent = new solanaWeb3_js.BN(await provider.getMinimumBalanceForRentExemption(Token.solana.TOKEN_LAYOUT.span));
    const owner = await getEscrowSolAccountPublicKey();

    const createAccountInstruction = solanaWeb3_js.SystemProgram.createAccount({
      fromPubkey: new solanaWeb3_js.PublicKey(paymentRoute.fromAddress),
      newAccountPubkey: wSolEscrowAccountKeypair.publicKey,
      programId: new solanaWeb3_js.PublicKey(Token.solana.TOKEN_PROGRAM),
      space: Token.solana.TOKEN_LAYOUT.span,
      lamports: rent
    });

    const initializeAccountInstruction = Token.solana.initializeAccountInstruction({
      account: wSolEscrowAccountKeypair.publicKey.toString(),
      token: Blockchains__default["default"].solana.wrapped.address,
      owner: owner.toString()
    });

    return [
      createAccountInstruction,
      initializeAccountInstruction
    ]
  };

  const getMiddleToken = ({ paymentRoute })=>{
    let path = [...paymentRoute.exchangeRoutes[0].path];
    if(path.indexOf(Blockchains__default["default"].solana.currency.address) > -1) { path.splice(path.indexOf(Blockchains__default["default"].solana.currency.address), 1); }
    if(path.indexOf(paymentRoute.fromToken.address) > -1) { path.splice(path.indexOf(paymentRoute.fromToken.address), 1); }
    if(path.indexOf(paymentRoute.toToken.address) > -1) { path.splice(path.indexOf(paymentRoute.toToken.address), 1); }

    if(path.length === 2 && path[0] === Blockchains__default["default"].solana.wrapped.address) {
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
    let seeds = [solanaWeb3_js.Buffer.from("payments"), new solanaWeb3_js.PublicKey(from).toBuffer()];

    let [ pdaPublicKey ] = await solanaWeb3_js.PublicKey.findProgramAddress(
      seeds, new solanaWeb3_js.PublicKey(routers$1.solana.address)
    );

    return pdaPublicKey
  };

  const getPaymentsAccountData = async({ from })=>{
    let address = (await getPaymentsAccountAddress({ from })).toString();
    return await request({
      blockchain: 'solana',
      address,
      api: solanaWeb3_js.struct([solanaWeb3_js.u64('anchorDiscriminator'), solanaWeb3_js.u64('nonce')]),
      cache: 1000
    })
  };

  const createPaymentsAccount = async({ from })=> {

    let paymentsAccountData = await getPaymentsAccountData({ from });
    if(paymentsAccountData) { 
      return
    }
    
    const keys = [
      { pubkey: solanaWeb3_js.SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: new solanaWeb3_js.PublicKey(from), isSigner: true, isWritable: true },
      { pubkey: await getPaymentsAccountAddress({ from }), isSigner: false, isWritable: true },
    ];

    const data = solanaWeb3_js.Buffer.alloc(routers$1.solana.api.createPaymentsAccount.layout.span);
    routers$1.solana.api.createPaymentsAccount.layout.encode({
      anchorDiscriminator: routers$1.solana.api.createPaymentsAccount.anchorDiscriminator
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({ 
      keys,
      programId: new solanaWeb3_js.PublicKey(routers$1.solana.address),
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
    
    if(paymentRoute.toToken.address === Blockchains__default["default"].solana.currency.address) {

      const paymentReceiverBalance = await request({ blockchain: 'solana', method: 'balance', address: paymentRoute.toAddress });
      const provider = await getProvider('solana');
      const rent = new solanaWeb3_js.BN(await provider.getMinimumBalanceForRentExemption(0));
      const paymentAmount = new solanaWeb3_js.BN(paymentRoute.toAmount);

      if(new solanaWeb3_js.BN(paymentReceiverBalance).add(paymentAmount).gt(rent)) {
        return
      }
      
      return solanaWeb3_js.SystemProgram.transfer({
        fromPubkey: new solanaWeb3_js.PublicKey(paymentRoute.fromAddress),
        toPubkey: new solanaWeb3_js.PublicKey(paymentRoute.toAddress),
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
    
    if(paymentRoute.toToken.address === Blockchains__default["default"].solana.currency.address) {

      const feeReceiverBalance = await request({ blockchain: 'solana', method: 'balance', address: paymentRoute.fee.receiver });
      const provider = await getProvider('solana');
      const rent = new solanaWeb3_js.BN(await provider.getMinimumBalanceForRentExemption(0));
      const feeAmount = new solanaWeb3_js.BN(paymentRoute.feeAmount);

      if(new solanaWeb3_js.BN(feeReceiverBalance).add(feeAmount).gt(rent)) {
        return
      }
      
      return solanaWeb3_js.SystemProgram.transfer({
        fromPubkey: new solanaWeb3_js.PublicKey(paymentRoute.fromAddress),
        toPubkey: new solanaWeb3_js.PublicKey(paymentRoute.fee.receiver),
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

    let seeds = [solanaWeb3_js.Buffer.from("escrow_sol")];
    
    let [ pdaPublicKey, bump ] = await solanaWeb3_js.PublicKey.findProgramAddress(
      seeds, new solanaWeb3_js.PublicKey(routers$1.solana.address)
    );

    return pdaPublicKey
  };

  const getEscrowSolAccountData = async({ paymentRoute })=>{
    return await request({
      blockchain: 'solana',
      address: (await getEscrowSolAccountPublicKey()).toString(),
      api: solanaWeb3_js.struct([ solanaWeb3_js.u64('amount'), solanaWeb3_js.publicKey('owner') ]),
      cache: 1000
    })
  };

  const getEscrowAccountPublicKey = async({ paymentRoute })=>{

    let seeds = [
      solanaWeb3_js.Buffer.from("escrow"),
      new solanaWeb3_js.PublicKey(paymentRoute.toToken.address === Blockchains__default["default"].solana.currency.address ? Blockchains__default["default"].solana.wrapped.address : paymentRoute.toToken.address).toBuffer()
    ];
    
    let [ pdaPublicKey, bump ] = await solanaWeb3_js.PublicKey.findProgramAddress(
      seeds, new solanaWeb3_js.PublicKey(routers$1.solana.address)
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

    if(paymentRoute.exchangeRoutes.length === 0 || paymentRoute.toToken.address === Blockchains__default["default"].solana.currency.address) {
      return
    }

    const escrowAccount = await getEscrowAccountData({ paymentRoute });

    if(escrowAccount) {
      return
    }

    const keys = [
      { pubkey: solanaWeb3_js.SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: new solanaWeb3_js.PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.toToken.address === Blockchains__default["default"].solana.currency.address ? Blockchains__default["default"].solana.wrapped.address : paymentRoute.toToken.address), isSigner: false, isWritable: true },
      { pubkey: await getEscrowAccountPublicKey({ paymentRoute }), isSigner: false, isWritable: true },
    ];

    const data = solanaWeb3_js.Buffer.alloc(routers$1.solana.api.createEscrowTokenAccount.layout.span);
    routers$1.solana.api.createEscrowTokenAccount.layout.encode({
      anchorDiscriminator: routers$1.solana.api.createEscrowTokenAccount.anchorDiscriminator
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({
      keys,
      programId: new solanaWeb3_js.PublicKey(routers$1.solana.address),
      data
    })
  };

  const createEscrowOutSolAccount = async({ paymentRoute })=> {

    if(
      paymentRoute.exchangeRoutes.length === 0 ||
      paymentRoute.toToken.address != Blockchains__default["default"].solana.currency.address
    ) {
      return
    }

    const escrowAccount = await getEscrowSolAccountData({ paymentRoute });

    if(escrowAccount) {
      return
    }

    const keys = [
      { pubkey: solanaWeb3_js.SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
      { pubkey: await getEscrowSolAccountPublicKey(), isSigner: false, isWritable: true },
    ];

    const data = solanaWeb3_js.Buffer.alloc(routers$1.solana.api.createEscrowSolAccount.layout.span);
    routers$1.solana.api.createEscrowSolAccount.layout.encode({
      anchorDiscriminator: routers$1.solana.api.createEscrowSolAccount.anchorDiscriminator
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({ 
      keys,
      programId: new solanaWeb3_js.PublicKey(routers$1.solana.address),
      data
    })
  };

  const getFixedPath = (path)=> path.filter((step)=>step!==Blockchains__default["default"].solana.currency.address);

  const getPaymentMethod = ({ paymentRoute })=>{

    if(
      paymentRoute.fromToken.address === Blockchains__default["default"].solana.currency.address &&
      paymentRoute.toToken.address === Blockchains__default["default"].solana.currency.address
    ){

      return 'routeSol'

    } else if (
      paymentRoute.fromToken.address !== Blockchains__default["default"].solana.currency.address &&
      paymentRoute.toToken.address !== Blockchains__default["default"].solana.currency.address &&
      paymentRoute.exchangeRoutes.length === 0
    ) {

      return 'routeToken'

    } else if (
      paymentRoute.exchangeRoutes.length > 0 &&
      getFixedPath(paymentRoute.exchangeRoutes[0].path).length === 2
    ) {

      if(paymentRoute.toToken.address === Blockchains__default["default"].solana.currency.address) {

        return 'routeOrcaSwapSolOut'

      } else {

        return 'routeOrcaSwap'

      }

    } else if (
      paymentRoute.exchangeRoutes.length > 0 &&
      getFixedPath(paymentRoute.exchangeRoutes[0].path).length > 2
    ) {

      if(paymentRoute.toToken.address === Blockchains__default["default"].solana.currency.address) {

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
    return paymentsAccountData ? paymentsAccountData.nonce : new solanaWeb3_js.BN('0')
  };

  const routeSol = async({ paymentRoute, nonce, deadline }) =>{

    const paymentReceiverPublicKey = new solanaWeb3_js.PublicKey(paymentRoute.toAddress);
    const feeReceiverPublicKey = paymentRoute.fee ? new solanaWeb3_js.PublicKey(paymentRoute.fee.receiver) : paymentReceiverPublicKey;

    const keys = [
      { pubkey: solanaWeb3_js.SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
      { pubkey: await getPaymentsAccountAddress({ from: paymentRoute.fromAddress }), isSigner: false, isWritable: true },
      { pubkey: paymentReceiverPublicKey, isSigner: false, isWritable: true },
      { pubkey: feeReceiverPublicKey, isSigner: false, isWritable: true },
    ];

    const data = solanaWeb3_js.Buffer.alloc(routers$1.solana.api.routeSol.layout.span);
    routers$1.solana.api.routeSol.layout.encode({
      anchorDiscriminator: routers$1.solana.api.routeSol.anchorDiscriminator,
      nonce,
      paymentAmount: new solanaWeb3_js.BN(paymentRoute.toAmount.toString()),
      feeAmount: new solanaWeb3_js.BN((paymentRoute.feeAmount || '0').toString()),
      deadline: new solanaWeb3_js.BN(deadline),
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({
      keys,
      programId: new solanaWeb3_js.PublicKey(routers$1.solana.address),
      data
    })
  };

  const routeToken = async({ paymentRoute, nonce, deadline }) =>{

    const senderTokenAccountAddress = await getPaymentSenderTokenAccountAddress({ paymentRoute });
    const paymentReceiverTokenAccountAddress = await getPaymentReceiverTokenAccountAddress({ paymentRoute });
    const feeReceiverTokenAccountAddress = paymentRoute.fee ? await getFeeReceiverTokenAccountAddress({ paymentRoute }) : paymentReceiverTokenAccountAddress;

    const keys = [
      { pubkey: new solanaWeb3_js.PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
      { pubkey: await getPaymentsAccountAddress({ from: paymentRoute.fromAddress }), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(senderTokenAccountAddress), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(paymentReceiverTokenAccountAddress), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(feeReceiverTokenAccountAddress), isSigner: false, isWritable: true },
    ];

    const data = solanaWeb3_js.Buffer.alloc(routers$1.solana.api.routeToken.layout.span);
    routers$1.solana.api.routeToken.layout.encode({
      anchorDiscriminator: routers$1.solana.api.routeToken.anchorDiscriminator,
      nonce,
      paymentAmount: new solanaWeb3_js.BN(paymentRoute.toAmount.toString()),
      feeAmount: new solanaWeb3_js.BN((paymentRoute.feeAmount || '0').toString()),
      deadline: new solanaWeb3_js.BN(deadline),
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({ 
      keys,
      programId: new solanaWeb3_js.PublicKey(routers$1.solana.address),
      data 
    })    
  };

  const routeOrcaSwap = async({ paymentRoute, nonce, wSolSenderAccountKeypair, deadline }) =>{

    const senderTokenAccountAddress = wSolSenderAccountKeypair ? wSolSenderAccountKeypair.publicKey : await getPaymentSenderTokenAccountAddress({ paymentRoute });
    const paymentReceiverTokenAccountAddress = await getPaymentReceiverTokenAccountAddress({ paymentRoute });
    const feeReceiverTokenAccountAddress = paymentRoute.fee ? await getFeeReceiverTokenAccountAddress({ paymentRoute }) : paymentReceiverTokenAccountAddress;
    const escrowOutPublicKey = await getEscrowAccountPublicKey({ paymentRoute });
    const exchangeRouteTransaction = await paymentRoute.exchangeRoutes[0].getTransaction({ account: paymentRoute.fromAddress });
    const exchangeRouteSwapInstruction = exchangeRouteTransaction.instructions.find((instruction)=>instruction.programId.toString() === routers$1.solana.ammProgram);

    const SWAP_LAYOUT = solanaWeb3_js.struct([
      solanaWeb3_js.u64("anchorDiscriminator"),
      solanaWeb3_js.u64("amount"),
      solanaWeb3_js.u64("otherAmountThreshold"),
      solanaWeb3_js.u128("sqrtPriceLimit"),
      solanaWeb3_js.bool("amountSpecifiedIsInput"),
      solanaWeb3_js.bool("aToB"),
    ]);
    const exchangeRouteSwapInstructionData = SWAP_LAYOUT.decode(exchangeRouteSwapInstruction.data);

    const keys = [
      // token_program
      { pubkey: new solanaWeb3_js.PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
      // amm_program
      { pubkey: new solanaWeb3_js.PublicKey(routers$1.solana.ammProgram), isSigner: false, isWritable: false },
      // sender
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
      // payments
      { pubkey: await getPaymentsAccountAddress({ from: paymentRoute.fromAddress }), isSigner: false, isWritable: true },
      // sender_token_account
      { pubkey: new solanaWeb3_js.PublicKey(senderTokenAccountAddress), isSigner: false, isWritable: true },
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
      { pubkey: new solanaWeb3_js.PublicKey(paymentReceiverTokenAccountAddress), isSigner: false, isWritable: true },
      // fee_receiver
      { pubkey: new solanaWeb3_js.PublicKey(feeReceiverTokenAccountAddress), isSigner: false, isWritable: true },
    ];

    const data = solanaWeb3_js.Buffer.alloc(routers$1.solana.api.routeOrcaSwap.layout.span);
    routers$1.solana.api.routeOrcaSwap.layout.encode({
      anchorDiscriminator: routers$1.solana.api.routeOrcaSwap.anchorDiscriminator,
      nonce,
      amountIn: exchangeRouteSwapInstructionData.amount,
      sqrtPriceLimit: exchangeRouteSwapInstructionData.sqrtPriceLimit,
      amountSpecifiedIsInput: exchangeRouteSwapInstructionData.amountSpecifiedIsInput,
      aToB: exchangeRouteSwapInstructionData.aToB,
      paymentAmount: new solanaWeb3_js.BN(paymentRoute.toAmount.toString()),
      feeAmount: new solanaWeb3_js.BN((paymentRoute.feeAmount || '0').toString()),
      deadline: new solanaWeb3_js.BN(deadline),
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({ 
      keys,
      programId: new solanaWeb3_js.PublicKey(routers$1.solana.address),
      data
    })
  };

  const routeOrcaSwapSolOut = async({ paymentRoute, nonce, wSolEscrowAccountKeypair, deadline }) =>{

    const senderTokenAccountAddress = await getPaymentSenderTokenAccountAddress({ paymentRoute });
    const escrowOutWsolPublicKey = wSolEscrowAccountKeypair.publicKey;
    const exchangeRouteTransaction = await paymentRoute.exchangeRoutes[0].getTransaction({ account: paymentRoute.fromAddress });
    const exchangeRouteSwapInstruction = exchangeRouteTransaction.instructions.find((instruction)=>instruction.programId.toString() === routers$1.solana.ammProgram);

    const SWAP_LAYOUT = solanaWeb3_js.struct([
      solanaWeb3_js.u64("anchorDiscriminator"),
      solanaWeb3_js.u64("amount"),
      solanaWeb3_js.u64("otherAmountThreshold"),
      solanaWeb3_js.u128("sqrtPriceLimit"),
      solanaWeb3_js.bool("amountSpecifiedIsInput"),
      solanaWeb3_js.bool("aToB"),
    ]);
    const exchangeRouteSwapInstructionData = SWAP_LAYOUT.decode(exchangeRouteSwapInstruction.data);

    const keys = [
      // system_program
      { pubkey: solanaWeb3_js.SystemProgram.programId, isSigner: false, isWritable: false },
      // token_program
      { pubkey: new solanaWeb3_js.PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
      // amm_program
      { pubkey: new solanaWeb3_js.PublicKey(routers$1.solana.ammProgram), isSigner: false, isWritable: false },
      // sender
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
      // payments
      { pubkey: await getPaymentsAccountAddress({ from: paymentRoute.fromAddress }), isSigner: false, isWritable: true },
      // sender_token_account
      { pubkey: new solanaWeb3_js.PublicKey(senderTokenAccountAddress), isSigner: false, isWritable: true },
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
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.toAddress), isSigner: false, isWritable: true },
      // fee_receiver
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.fee ? paymentRoute.fee.receiver : paymentRoute.toAddress), isSigner: false, isWritable: true },
    ];

    const data = solanaWeb3_js.Buffer.alloc(routers$1.solana.api.routeOrcaSwapSolOut.layout.span);
    routers$1.solana.api.routeOrcaSwapSolOut.layout.encode({
      anchorDiscriminator: routers$1.solana.api.routeOrcaSwapSolOut.anchorDiscriminator,
      nonce,
      amountIn: exchangeRouteSwapInstructionData.amount,
      sqrtPriceLimit: exchangeRouteSwapInstructionData.sqrtPriceLimit,
      amountSpecifiedIsInput: exchangeRouteSwapInstructionData.amountSpecifiedIsInput,
      aToB: exchangeRouteSwapInstructionData.aToB,
      paymentAmount: new solanaWeb3_js.BN(paymentRoute.toAmount.toString()),
      feeAmount: new solanaWeb3_js.BN((paymentRoute.feeAmount || '0').toString()),
      deadline: new solanaWeb3_js.BN(deadline),
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({ 
      keys,
      programId: new solanaWeb3_js.PublicKey(routers$1.solana.address),
      data
    })
  };

  const routeOrcaTwoHopSwap = async({ paymentRoute, nonce, wSolSenderAccountKeypair, deadline }) =>{

    const paymentReceiverTokenAccountPublicKey = new solanaWeb3_js.PublicKey(await getPaymentReceiverTokenAccountAddress({ paymentRoute }));
    const feeReceiverTokenAccountPublicKey = paymentRoute.fee ? new solanaWeb3_js.PublicKey(await getFeeReceiverTokenAccountAddress({ paymentRoute })) : paymentReceiverTokenAccountPublicKey;
    const escrowOutPublicKey = await getEscrowAccountPublicKey({ paymentRoute });
    const middleTokenAccountPublicKey = new solanaWeb3_js.PublicKey(await getMiddleTokenAccountAddress({ paymentRoute }));
    const exchangeRouteTransaction = await paymentRoute.exchangeRoutes[0].getTransaction({ account: paymentRoute.fromAddress });
    const exchangeRouteSwapInstruction = exchangeRouteTransaction.instructions.find((instruction)=>instruction.programId.toString() === routers$1.solana.ammProgram);
    const senderTokenAccountPublicKey = wSolSenderAccountKeypair ? wSolSenderAccountKeypair.publicKey : new solanaWeb3_js.PublicKey(await getPaymentSenderTokenAccountAddress({ paymentRoute }));

    const SWAP_LAYOUT = solanaWeb3_js.struct([
      solanaWeb3_js.u64("anchorDiscriminator"),
      solanaWeb3_js.u64("amount"),
      solanaWeb3_js.u64("otherAmountThreshold"),
      solanaWeb3_js.bool("amountSpecifiedIsInput"),
      solanaWeb3_js.bool("aToBOne"),
      solanaWeb3_js.bool("aToBTwo"),
      solanaWeb3_js.u128("sqrtPriceLimitOne"),
      solanaWeb3_js.u128("sqrtPriceLimitTwo"),
    ]);
    const exchangeRouteSwapInstructionData = SWAP_LAYOUT.decode(exchangeRouteSwapInstruction.data);

    const keys = [
      // token_program
      { pubkey: new solanaWeb3_js.PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
      // amm_program
      { pubkey: new solanaWeb3_js.PublicKey(routers$1.solana.ammProgram), isSigner: false, isWritable: false },
      // sender
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
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

    const data = solanaWeb3_js.Buffer.alloc(routers$1.solana.api.routeOrcaTwoHopSwap.layout.span);
    routers$1.solana.api.routeOrcaTwoHopSwap.layout.encode({
      anchorDiscriminator: routers$1.solana.api.routeOrcaTwoHopSwap.anchorDiscriminator,
      nonce,
      amountIn: exchangeRouteSwapInstructionData.amount,
      amountSpecifiedIsInput: exchangeRouteSwapInstructionData.amountSpecifiedIsInput,
      aToBOne: exchangeRouteSwapInstructionData.aToBOne,
      aToBTwo: exchangeRouteSwapInstructionData.aToBTwo,
      sqrtPriceLimitOne: exchangeRouteSwapInstructionData.sqrtPriceLimitOne,
      sqrtPriceLimitTwo: exchangeRouteSwapInstructionData.sqrtPriceLimitTwo,
      paymentAmount: new solanaWeb3_js.BN(paymentRoute.toAmount.toString()),
      feeAmount: new solanaWeb3_js.BN((paymentRoute.feeAmount || '0').toString()),
      deadline: new solanaWeb3_js.BN(deadline),
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({ 
      keys,
      programId: new solanaWeb3_js.PublicKey(routers$1.solana.address),
      data
    })
  };

  const routeOrcaTwoHopSwapSolOut = async({ paymentRoute, nonce, wSolEscrowAccountKeypair, deadline }) =>{

    const middleTokenAccountPublicKey = new solanaWeb3_js.PublicKey(await getMiddleTokenAccountAddress({ paymentRoute }));
    const exchangeRouteTransaction = await paymentRoute.exchangeRoutes[0].getTransaction({ account: paymentRoute.fromAddress });
    const exchangeRouteSwapInstruction = exchangeRouteTransaction.instructions.find((instruction)=>instruction.programId.toString() === routers$1.solana.ammProgram);
    const senderTokenAccountPublicKey = new solanaWeb3_js.PublicKey(await getPaymentSenderTokenAccountAddress({ paymentRoute }));

    const SWAP_LAYOUT = solanaWeb3_js.struct([
      solanaWeb3_js.u64("anchorDiscriminator"),
      solanaWeb3_js.u64("amount"),
      solanaWeb3_js.u64("otherAmountThreshold"),
      solanaWeb3_js.bool("amountSpecifiedIsInput"),
      solanaWeb3_js.bool("aToBOne"),
      solanaWeb3_js.bool("aToBTwo"),
      solanaWeb3_js.u128("sqrtPriceLimitOne"),
      solanaWeb3_js.u128("sqrtPriceLimitTwo"),
    ]);
    const exchangeRouteSwapInstructionData = SWAP_LAYOUT.decode(exchangeRouteSwapInstruction.data);

    const keys = [
      // system_program
      { pubkey: solanaWeb3_js.SystemProgram.programId, isSigner: false, isWritable: false },
      // token_program
      { pubkey: new solanaWeb3_js.PublicKey(Token.solana.TOKEN_PROGRAM), isSigner: false, isWritable: false },
      // amm_program
      { pubkey: new solanaWeb3_js.PublicKey(routers$1.solana.ammProgram), isSigner: false, isWritable: false },
      // sender
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.fromAddress), isSigner: true, isWritable: true },
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
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.toAddress), isSigner: false, isWritable: true },
      // fee_receiver
      { pubkey: new solanaWeb3_js.PublicKey(paymentRoute.fee ? paymentRoute.fee.receiver : paymentRoute.toAddress), isSigner: false, isWritable: true },
    ];

    const data = solanaWeb3_js.Buffer.alloc(routers$1.solana.api.routeOrcaTwoHopSwapSolOut.layout.span);
    routers$1.solana.api.routeOrcaTwoHopSwapSolOut.layout.encode({
      anchorDiscriminator: routers$1.solana.api.routeOrcaTwoHopSwapSolOut.anchorDiscriminator,
      nonce,
      amountIn: exchangeRouteSwapInstructionData.amount,
      amountSpecifiedIsInput: exchangeRouteSwapInstructionData.amountSpecifiedIsInput,
      aToBOne: exchangeRouteSwapInstructionData.aToBOne,
      aToBTwo: exchangeRouteSwapInstructionData.aToBTwo,
      sqrtPriceLimitOne: exchangeRouteSwapInstructionData.sqrtPriceLimitOne,
      sqrtPriceLimitTwo: exchangeRouteSwapInstructionData.sqrtPriceLimitTwo,
      paymentAmount: new solanaWeb3_js.BN(paymentRoute.toAmount.toString()),
      feeAmount: new solanaWeb3_js.BN((paymentRoute.feeAmount || '0').toString()),
      deadline: new solanaWeb3_js.BN(deadline),
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({ 
      keys,
      programId: new solanaWeb3_js.PublicKey(routers$1.solana.address),
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

  const getTransaction$2 = async({ paymentRoute })=> {

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
      alts: [routers$1.solana.alt]
    };

    // debug(transaction, paymentRoute)

    transaction.deadline = deadline;
    transaction.nonce = nonce.toString();

    return transaction
  };

  const API = [{"inputs":[{"internalType":"address","name":"_PERMIT2","type":"address"},{"internalType":"address","name":"_FORWARDER","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ExchangeCallFailed","type":"error"},{"inputs":[],"name":"ExchangeCallMissing","type":"error"},{"inputs":[],"name":"ExchangeNotApproved","type":"error"},{"inputs":[],"name":"ForwardingPaymentFailed","type":"error"},{"inputs":[],"name":"InsufficientBalanceInAfterPayment","type":"error"},{"inputs":[],"name":"InsufficientBalanceOutAfterPayment","type":"error"},{"inputs":[],"name":"NativeFeePaymentFailed","type":"error"},{"inputs":[],"name":"NativePaymentFailed","type":"error"},{"inputs":[],"name":"PaymentDeadlineReached","type":"error"},{"inputs":[],"name":"PaymentToZeroAddressNotAllowed","type":"error"},{"inputs":[],"name":"WrongAmountPaidIn","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"exchange","type":"address"}],"name":"Disabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"exchange","type":"address"}],"name":"Enabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"InternalTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"FORWARDER","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"exchange","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"enable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"exchanges","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"bool","name":"permit2","type":"bool"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"uint256","name":"feeAmount","type":"uint256"},{"internalType":"address","name":"tokenInAddress","type":"address"},{"internalType":"address","name":"exchangeAddress","type":"address"},{"internalType":"address","name":"tokenOutAddress","type":"address"},{"internalType":"address","name":"paymentReceiverAddress","type":"address"},{"internalType":"address","name":"feeReceiverAddress","type":"address"},{"internalType":"uint8","name":"exchangeType","type":"uint8"},{"internalType":"uint8","name":"receiverType","type":"uint8"},{"internalType":"bytes","name":"exchangeCallData","type":"bytes"},{"internalType":"bytes","name":"receiverCallData","type":"bytes"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct IDePayRouterV2.Payment","name":"payment","type":"tuple"}],"name":"pay","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"bool","name":"permit2","type":"bool"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"uint256","name":"feeAmount","type":"uint256"},{"internalType":"address","name":"tokenInAddress","type":"address"},{"internalType":"address","name":"exchangeAddress","type":"address"},{"internalType":"address","name":"tokenOutAddress","type":"address"},{"internalType":"address","name":"paymentReceiverAddress","type":"address"},{"internalType":"address","name":"feeReceiverAddress","type":"address"},{"internalType":"uint8","name":"exchangeType","type":"uint8"},{"internalType":"uint8","name":"receiverType","type":"uint8"},{"internalType":"bytes","name":"exchangeCallData","type":"bytes"},{"internalType":"bytes","name":"receiverCallData","type":"bytes"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct IDePayRouterV2.Payment","name":"payment","type":"tuple"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IPermit2.PermitDetails","name":"details","type":"tuple"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IPermit2.PermitSingle","name":"permitSingle","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"pay","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"pendingOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

  var solanaRouters = {

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

  let evmRouters = {};


  var routers = {... evmRouters, ...solanaRouters};

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

  let supported = ['solana'];
  supported.evm = [];
  supported.solana = ['solana'];

  let evmGetTransaction = ()=>{};

  const getTransaction$1 = ({ paymentRoute, fee })=>{
    if(supported.evm.includes(paymentRoute.blockchain)) {
      return evmGetTransaction()
    } else if(supported.solana.includes(paymentRoute.blockchain)) {
      return getTransaction$2({ paymentRoute, fee })
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
      this.approvalRequired = approvalRequired;
      this.approvalTransaction = approvalTransaction;
      this.directTransfer = directTransfer;
      this.getTransaction = async ()=> await getTransaction$1({ paymentRoute: this });
    }
  }

  function convertToRoutes({ assets, accept, from }) {
    return Promise.all(assets.map(async (asset)=>{
      let relevantConfigurations = accept.filter((configuration)=>(configuration.blockchain == asset.blockchain));
      let fromToken = new Token__default["default"](asset);
      return Promise.all(relevantConfigurations.map(async (configuration)=>{
        if(configuration.token && configuration.amount) {
          let blockchain = configuration.blockchain;
          let fromDecimals = asset.decimals;
          let toToken = new Token__default["default"]({ blockchain, address: configuration.token });
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
          let toToken = new Token__default["default"]({ blockchain, address: configuration.toToken });
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
        if(!priority.find((priority)=>priority.blockchain === blockchain && priority.address === Blockchains__default["default"][blockchain].currency.address)) {
          priority.push({ blockchain, address: Blockchains__default["default"][blockchain].currency.address });
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
        if (a.address.toLowerCase() === Blockchains__default["default"][a.blockchain].currency.address.toLowerCase()) {
          return -1 // a wins
        }
        if (b.address.toLowerCase() === Blockchains__default["default"][b.blockchain].currency.address.toLowerCase()) {
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

      const allAssets = await web3AssetsSolana.dripAssets({
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
          return Exchanges__default["default"].route({
            blockchain: route.blockchain,
            tokenIn: route.fromToken.address,
            tokenOut: route.toToken.address,
            amountOutMin: route.toAmount,
            fromAddress: route.fromAddress,
            toAddress: route.toAddress
          })
        } else if(route.fromToken && route.fromAmount) {
          return Exchanges__default["default"].route({
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
        return ethers.ethers.BigNumber.from(route.fromBalance).gte(ethers.ethers.BigNumber.from(route.toAmount))
      } else if(route.fromAmount && route.toAmount) {
        return ethers.ethers.BigNumber.from(route.fromBalance).gte(ethers.ethers.BigNumber.from(route.exchangeRoutes[0].amountInMax))
      } else if(route.exchangeRoutes[0] && route.exchangeRoutes[0].amountIn) {
        return ethers.ethers.BigNumber.from(route.fromBalance).gte(ethers.ethers.BigNumber.from(route.exchangeRoutes[0].amountIn))
      }
    })
  };

  let addApproval = (routes) => {
    return Promise.all(routes.map(
      (route) => {
        if(route.blockchain === 'solana') {
          return Promise.resolve(Blockchains__default["default"].solana.maxInt)
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
              route.fromToken.address.toLowerCase() == Blockchains__default["default"][route.blockchain].currency.address.toLowerCase() ||
              route.blockchain === 'solana'
            )
          ) {
            routes[index].approvalRequired = false;
          } else {
            routes[index].approvalRequired = ethers.ethers.BigNumber.from(route.fromAmount).gte(ethers.ethers.BigNumber.from(allowances[index]));
            if(routes[index].approvalRequired) {
              routes[index].approvalTransaction = {
                blockchain: route.blockchain,
                to: route.fromToken.address,
                api: Token__default["default"][route.blockchain].DEFAULT,
                method: 'approve',
                params: [routers[route.blockchain].address, Blockchains__default["default"][route.blockchain].maxInt]
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
      return ethers.ethers.BigNumber.from(amount).sub(feeAmount).toString()
    } else {
      return amount
    }
  };

  let getFeeAmount = ({ paymentRoute })=> {
    if(typeof paymentRoute.fee.amount == 'string' && paymentRoute.fee.amount.match('%')) {
      return ethers.ethers.BigNumber.from(paymentRoute.toAmount).mul(parseFloat(paymentRoute.fee.amount)*10).div(1000).toString()
    } else if(typeof paymentRoute.fee.amount == 'string') {
      return paymentRoute.fee.amount
    } else if(typeof paymentRoute.fee.amount == 'number') {
      return ethers.ethers.utils.parseUnits(paymentRoute.fee.amount.toString(), paymentRoute.toDecimals).toString()
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
        if(ethers.ethers.BigNumber.from(routeB.fromAmount).lt(ethers.ethers.BigNumber.from(routeA.fromAmount)) && !routeA.directTransfer) { return true }
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
      if (JSON.stringify([a.fromToken.address.toLowerCase(), a.toToken.address.toLowerCase()].sort()) == JSON.stringify([Blockchains__default["default"][a.blockchain].currency.address.toLowerCase(), Blockchains__default["default"][a.blockchain].wrapped.address.toLowerCase()].sort())) {
        return aWins
      }
      if (JSON.stringify([b.fromToken.address.toLowerCase(), b.toToken.address.toLowerCase()].sort()) == JSON.stringify([Blockchains__default["default"][b.blockchain].currency.address.toLowerCase(), Blockchains__default["default"][b.blockchain].wrapped.address.toLowerCase()].sort())) {
        return bWins
      }

      // NATIVE input token is more cost efficient
      if (a.fromToken.address.toLowerCase() == Blockchains__default["default"][a.blockchain].currency.address.toLowerCase()) {
        return aWins
      }
      if (b.fromToken.address.toLowerCase() == Blockchains__default["default"][b.blockchain].currency.address.toLowerCase()) {
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
      return getTransaction$2({ paymentRoute })
    }
  };

  exports.getTransaction = getTransaction;
  exports.route = route;
  exports.routers = routers;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
