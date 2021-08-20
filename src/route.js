import plugins from './plugins'
import routers from './routers'
import { CONSTANTS } from 'depay-web3-constants'
import { getAssets } from 'depay-web3-assets'
import { route as exchangeRoute } from 'depay-web3-exchanges'
import { routeToTransaction } from './transaction'
import { Token } from 'depay-web3-tokens'
import { Transaction } from 'depay-web3-transaction'

class PaymentRoute {
  constructor({ blockchain, fromToken, toToken, toAmount, fromAddress, toAddress }) {
    this.blockchain = blockchain
    this.fromToken = fromToken
    this.fromBalance = 0
    this.toToken = toToken
    this.toAmount = toAmount
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.exchangeRoutes = []
    this.transaction = undefined
    this.approvalRequired = undefined
    this.approve = undefined
    this.directTransfer = undefined
  }
}

async function route({ blockchain, fromAddress, toAddress, token, amount, apiKey }) {
  let toToken = new Token({ blockchain, address: token })
  let amountBN = await toToken.BigNumber(amount)
  let paymentRoutes = await getAssets({ blockchain, apiKey })
    .then(assetsToTokens)
    .then(filterTransferable)
    .then((tokens) => convertToRoutes({ tokens, toToken, toAmount: amountBN, fromAddress, toAddress }))
    .then((routes) => addExchangeRoutes({ blockchain, routes, amount, fromAddress, toAddress }))
    .then(filterExchangeRoutesWithoutPlugin)
    .then((routes) => filterNotRoutable({ routes, token }))
    .then((routes) => addBalances({ routes, fromAddress }))
    .then((routes) => filterInsufficientBalance({ routes, token, amountBN }))
    .then((routes) => addApproval({ routes, blockchain }))
    .then((routes) => addDirectTransferStatus({ routes, blockchain, token }))
    .then((routes) => sortPaymentRoutes({ routes, token }))
    .then(addTransactions)
    .then(addFromAmount)

  return paymentRoutes
}

let addBalances = async ({ routes, fromAddress }) => {
  return Promise.all(routes.map((route) => route.fromToken.balance(fromAddress))).then((balances) => {
    balances.forEach((balance, index) => {
      routes[index].fromBalance = balance
    })
    return routes
  })
}

let assetsToTokens = async (assets) => {
  return assets.map((asset) => new Token({ blockchain: asset.blockchain, address: asset.address }))
}

let filterTransferable = async (tokens) => {
  return await Promise.all(tokens.map((token) => token.transferable())).then((transferables) =>
    tokens.filter((token, index) => transferables[index]),
  )
}

let convertToRoutes = ({ tokens, toToken, toAmount, fromAddress, toAddress }) => {
  return tokens.map((token) => {
    return new PaymentRoute({
      blockchain: toToken.blockchain,
      fromToken: token,
      toToken,
      toAmount,
      fromAddress,
      toAddress
    })
  })
}

let addExchangeRoutes = async ({ blockchain, routes, amount, fromAddress, toAddress }) => {
  return await Promise.all(
    routes.map((route) => {
      return exchangeRoute({
        blockchain,
        tokenIn: route.fromToken.address,
        tokenOut: route.toToken.address,
        amountOutMin: amount,
        fromAddress,
        toAddress,
      })
    }),
  ).then((exchangeRoutes) => {
    return routes.map((route, index) => {
      route.exchangeRoutes = exchangeRoutes[index]
      return route
    })
  })
}

let filterExchangeRoutesWithoutPlugin = (routes) => {
  return routes.filter((route)=>{
    if(route.exchangeRoutes.length == 0) { return true }
    return plugins[route.blockchain][route.exchangeRoutes[0].exchange.name] != undefined
  })
}

let filterNotRoutable = ({ routes, token }) => {
  return routes.filter((route) => {
    return (
      route.exchangeRoutes.length != 0 ||
      route.fromToken.address.toLowerCase() == token.toLowerCase() // direct transfer always possible
    )
  })
}

let filterInsufficientBalance = ({ routes, token, amountBN }) => {
  return routes.filter((route) => {
    if (route.fromToken.address.toLowerCase() == token.toLowerCase()) {
      return route.fromBalance.gte(amountBN)
    } else {
      return route.fromBalance.gte(route.exchangeRoutes[0].amountInMax)
    }
  })
}

let addApproval = ({ routes, blockchain }) => {
  return Promise.all(routes.map(
    (route) => route.fromToken.allowance(routers[blockchain].address)
  )).then(
    (allowances) => {
      routes.forEach((route, index) => {
        if(route.fromToken.toLowerCase() == CONSTANTS[blockchain].NATIVE.toLowerCase()) {
          routes[index].approvalRequired = false
        } else {
          routes[index].approvalRequired = route.fromBalance.gte(allowances[index])
          if(routes[index].approvalRequired) {
            routes[index].approve = (options)=>{
              options = options || {}
              let approvalTransaction = new Transaction({
                blockchain,
                address: routes[index].fromToken.address,
                api: Token[blockchain].DEFAULT,
                method: 'approve',
                params: [routers[blockchain].address, CONSTANTS[blockchain].MAXINT]
              })
              return approvalTransaction.submit(options)
            }
          }
        }
      })
      return routes
    },
  )
}

let addDirectTransferStatus = ({ routes, blockchain, token }) => {
  return routes.map((route)=>{
    route.directTransfer = route.blockchain == blockchain && route.fromToken.address.toLowerCase() == token.toLowerCase()
    return route
  })
}

let addFromAmount = (routes)=> {
  return routes.map((route)=>{
    if(route.directTransfer) {
      if(route.fromToken.address.toLowerCase() == CONSTANTS[route.blockchain].NATIVE.toLowerCase()) {
        route.fromAmount = route.transaction.value
      } else {
        route.fromAmount = route.transaction.params[1]
      }
    } else {
      route.fromAmount = route.transaction.params.amounts[0]
    }
    return route
  })
}

let sortPaymentRoutes = ({ routes, token }) => {
  let aWins = -1
  let bWins = 1
  let equal = 0
  return routes.sort((a, b) => {
    if (a.fromToken.address.toLowerCase() == token.toLowerCase()) {
      return aWins
    }
    if (b.fromToken.address.toLowerCase() == token.toLowerCase()) {
      return bWins
    }

    if (a.approvalRequired && !b.approvalRequired) {
      return bWins
    }
    if (b.approvalRequired && !a.approvalRequired) {
      return aWins
    }

    if (a.fromToken.address.toLowerCase() == CONSTANTS[a.blockchain].NATIVE.toLowerCase()) {
      return aWins
    }
    if (b.fromToken.address.toLowerCase() == CONSTANTS[b.blockchain].NATIVE.toLowerCase()) {
      return bWins
    }

    return equal
  })
}

let addTransactions = (routes) => {
  return routes.map((route)=>{
    route.transaction = routeToTransaction({ paymentRoute: route })
    return route
  })
}

export default route
