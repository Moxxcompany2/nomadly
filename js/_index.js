/*global process */
const {
  rem,
  html,
  tickerOf,
  discountOn,
  tickerViewOf,
  buyLeadsSelectCountry,
  priceOf,
  buyLeadsSelectSmsVoice,
  buyLeadsSelectArea,
  buyLeadsSelectAreaCode,
  buyLeadsSelectCarrier,
  buyLeadsSelectCnam,
  buyLeadsSelectFormat,
  phoneNumberLeads,
  _buyLeadsSelectAreaCode,
  buyLeadsSelectAmount,
  validatorSelectCountry,
  validatorSelectSmsVoice,
  validatorSelectCarrier,
  validatorSelectAmount,
  validatorSelectFormat,
  dynopayActions,
  tickerOfDyno,
  tickerViewOfDyno,
  t,
} = require('./config.js')
const createShortBitly = require('./bitly.js')
const { createShortUrlApi, analyticsCuttly } = require('./cuttly.js')
const {
  week,
  year,
  month,
  today,
  isAdmin,
  usdToNgn,
  ngnToUsd,
  isValidUrl,
  nextNumber,
  getBalance,
  sendQrCode,
  isDeveloper,
  isValidEmail,
  subscribePlan,
  regularCheckDns,
  sendMessageToAllUsers,
  parse,
  extractPhoneNumbers,
  sendQr,
  sleep,
  sendMessage,
  checkFreeTrialTaken,
  removeProtocolFromDomain,
  planCheckExistingDomain,
  planGetNewDomain,
  generateQr,
} = require('./utils.js')
const fs = require('fs')
require('dotenv').config()
const cors = require('cors')
const axios = require('axios')
const express = require('express')
const { log } = require('console')
const { MongoClient, ServerApiVersion } = require('mongodb')
const { customAlphabet } = require('nanoid')
const TelegramBot = require('node-telegram-bot-api')
const { createCheckout } = require('./pay-fincra.js')
const viewDNSRecords = require('./cr-view-dns-records.js')
const { deleteDNSRecord } = require('./cr-dns-record-del.js')
const { buyDomainOnline } = require('./cr-domain-register.js')
const { saveServerInDomain } = require('./cr-dns-record-add.js')
const { updateDNSRecord } = require('./cr-dns-record-update.js')
const { checkDomainPriceOnline } = require('./cr-domain-price-get.js')
const { saveDomainInServerRailway, saveDomainInServerRender } = require('./rl-save-domain-in-server.js')
const { get, set, del, increment, getAll, decrement, insert } = require('./db.js')
const { getRegisteredDomainNames } = require('./cr-domain-purchased-get.js')
const { getCryptoDepositAddress, convert } = require('./pay-blockbee.js')
const { validateBulkNumbers } = require('./validatePhoneBulk.js')
const { countryCodeOf, areasOfCountry } = require('./areasOfCountry.js')
const { validatePhoneBulkFile } = require('./validatePhoneBulkFile.js')
const createCustomShortUrlCuttly = require('./customCuttly.js')
const schedule = require('node-schedule')
const { registerDomainAndCreateCpanel } = require('./cr-register-domain-&-create-cpanel.js')
const { isEmail } = require('validator')
const { 
  getDynopayCryptoAddress,
} = require('./pay-dynopay.js')
const { translation } = require('./translation.js')

process.env['NTBA_FIX_350'] = 1
const DB_NAME = process.env.DB_NAME
const SELF_URL = process.env.SELF_URL
const NOT_TRY_CR = process.env.NOT_TRY_CR
const RATE_LEAD = Number(process.env.RATE_LEAD)
const RATE_CNAM = Number(process.env.RATE_CNAM)
const PRICE_BITLY_LINK = Number(process.env.PRICE_BITLY_LINK)
const RATE_LEAD_VALIDATOR = Number(process.env.RATE_LEAD_VALIDATOR)
const RATE_CNAM_VALIDATOR = Number(process.env.RATE_CNAM_VALIDATOR)
const FREE_LINKS = Number(process.env.FREE_LINKS)
const HOSTED_ON = process.env.HOSTED_ON

const CHAT_BOT_NAME = process.env.CHAT_BOT_NAME
const REST_APIS_ON = process.env.REST_APIS_ON
const TELEGRAM_BOT_ON = process.env.TELEGRAM_BOT_ON
const BLOCKBEE_CRYTPO_PAYMENT_ON = process.env.BLOCKBEE_CRYTPO_PAYMENT_ON
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_DEV_CHAT_ID = process.env.TELEGRAM_DEV_CHAT_ID
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID
const FREE_LINKS_TIME_SECONDS = Number(process.env.FREE_LINKS_TIME_SECONDS) * 1000 // to milliseconds
const TELEGRAM_DOMAINS_SHOW_CHAT_ID = Number(process.env.TELEGRAM_DOMAINS_SHOW_CHAT_ID)
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 5)

// HOSTING ENVIRONMENT
const HOSTING_STARTER_PLAN_PRICE = parseFloat(process.env.HOSTING_STARTER_PLAN_PRICE)
const HOSTING_BUSINESS_PLAN_PRICE = parseFloat(process.env.HOSTING_BUSINESS_PLAN_PRICE)
const HOSTING_PRO_PLAN_PRICE = parseFloat(process.env.HOSTING_PRO_PLAN_PRICE)

if (!DB_NAME || !RATE_LEAD_VALIDATOR || !HOSTED_ON || !TELEGRAM_BOT_ON || !REST_APIS_ON || !CHAT_BOT_NAME) {
  return log('Service is paused because some ENV variable is missing')
}

let bot

if (TELEGRAM_BOT_ON === 'true') bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true })
else bot = {
  on: () => {
  }, sendMessage: () => {
  }, sendPhoto: () => {
  }, sendDocument: () => {
  },
}

log('TELEGRAM_BOT_ON: ' + TELEGRAM_BOT_ON)
log('Bot ran away! ' + new Date())

const send = (chatId, message, options) => {
  log('reply: ' + message + ' ' + (options?.reply_markup?.keyboard?.map(i => i) || '') + '\tto: ' + chatId + '\n')
  bot?.sendMessage(chatId, message, options)?.catch(e => log(e.message + ': ' + chatId))
}

// variables to implement core functionality
let state = {},
  walletOf = {},
  linksOf = {},
  expiryOf = {},
  fullUrlOf = {},
  maskOf = {},
  domainsOf = {},
  chatIdBlocked = {},
  planEndingTime = {},
  chatIdOfPayment = {},
  chatIdOfDynopayPayment = {},
  totalShortLinks = {},
  freeShortLinksOf = {},
  freeSmsCountOf = {},
  clicksOfSms = {},
  freeDomainNamesAvailableFor = {},
  hostingTransactions = {}


// variables to view system information
let nameOf = {},
  planOf = {},
  payments = {},
  clicksOf = {},
  clicksOn = {},
  loginCountOf = {},
  chatIdOf = {},
  canLogin = {}

// some info to use with bot
let adminDomains = [],
  connect_reseller_working = true

// restoreData(); // can be use when there is no db

let db
const loadData = async () => {
  db = client.db(DB_NAME)

  // variables to implement core functionality
  state = db.collection('state')
  linksOf = db.collection('linksOf')
  walletOf = db.collection('walletOf')
  expiryOf = db.collection('expiryOf')
  maskOf = db.collection('maskOf')
  fullUrlOf = db.collection('fullUrlOf')
  domainsOf = db.collection('domainsOf')
  loginCountOf = db.collection('loginCountOf')
  canLogin = db.collection('canLogin')
  chatIdBlocked = db.collection('chatIdBlocked')
  planEndingTime = db.collection('planEndingTime')
  chatIdOfPayment = db.collection('chatIdOfPayment')
  chatIdOfDynopayPayment = db.collection('chatIdOfDynopayPayment')
  totalShortLinks = db.collection('totalShortLinks')
  freeShortLinksOf = db.collection('freeShortLinksOf')
  freeSmsCountOf = db.collection('freeSmsCountOf')
  clicksOfSms = db.collection('clicksOfSms')
  hostingTransactions = db.collection('hostingTransactions')

  freeDomainNamesAvailableFor = db.collection('freeDomainNamesAvailableFor')

  // variables to view system information
  nameOf = db.collection('nameOf')
  planOf = db.collection('planOf')
  payments = db.collection('payments')
  clicksOf = db.collection('clicksOf')
  clicksOn = db.collection('clicksOn')
  chatIdOf = db.collection('chatIdOf')

  if (REST_APIS_ON === 'true') startServer()

  log(`DB Connected lala. May peace be with you and Lord's mercy and blessings.`)

  //
  // sendMessage(6687923716, 'bot started')
  // buyDomainFullProcess(6687923716, 'ehtesham.sbs')

  // set(freeShortLinksOf, 6687923716, 20)
  // Bohut zalil karaya is galat line nai : await set(wallet **** 00)
  // {
  //   await del(walletOf, 6687923716)
  //   await set(walletOf, 6687923716, 'usdIn', 100)
  //   await set(walletOf, 6687923716, 'ngnIn', 100000)
  //   const w = await get(walletOf, 6687923716)
  //   log({ w })
  // }
  // {
  //   await del(walletOf, 5590563715)
  //   await set(walletOf, 5590563715, 'usdIn', 100)
  //   await set(walletOf, 5590563715, 'ngnIn', 100000)
  //   const w = await get(walletOf, 5590563715)
  //   log({ w })
  // }

  // 5590563715, 5168006768 chat id client
  // 6687923716 chat id testing
  // set(walletOf, 6687923716, { usdIn: 100, ngnIn: 100000 })
  // set(planEndingTime, 6687923716, 0)
  // set(freeShortLinksOf, 6687923716, FREE_LINKS)
  // adminDomains = await getPurchasedDomains(TELEGRAM_DOMAINS_SHOW_CHAT_ID)
}

const client = new MongoClient(process.env.MONGO_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
client
  .connect()
  .then(loadData)
  .catch(err => log('DB Error bro', err, err?.message))


async function sendRemindersForExpiringPackages() {
  const now = new Date()
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

  try {
    const users = await state.find({
      'currentPackage.name': 'Freedom Plan',
      'currentPackage.expiresAt': { $lte: oneHourFromNow, $gt: now },
      'reminders.beforeExpireReminderSent': false,
    }).toArray()

    for (const user of users) {
      send(user._id, translation('t.oneHourLeftToExpireTrialPlan'))

      await state.updateOne(
        { _id: user._id },
        { $set: { 'reminders.beforeExpireReminderSent': true } },
      )
    }

    const expiredUsers = await state.find({
      'currentPackage.name': 'Freedom Plan',
      'currentPackage.expiresAt': { $lte: now },
      'reminders.expireReminderSent': false,
      'currentPackage.isActive': true,
    }).toArray()

    for (const user of expiredUsers) {
      send(user._id, t.freePlanExpired)

      await state.updateOne(
        { _id: user._id },
        {
          $set: {
            'reminders.expireReminderSent': true,
            'currentPackage.isActive': false,
          },
        },
      )
    }

  } catch (error) {
    console.error('Error sending reminders:', error)
  }
}

schedule.scheduleJob('* * * * *', function() {
  sendRemindersForExpiringPackages()
})

bot?.on('message', async msg => {
  const chatId = msg?.chat?.id
  const message = msg?.text || ''
  log('message: ' + message + '\tfrom: ' + chatId + ' ' + msg?.from?.username)
  NOT_TRY_CR === undefined && tryConnectReseller() // our ip may change on railway hosting so make sure its correct

  if (
    'https://nomadly-4mxx.onrender.com' !==
    (await axios.get('https://raw.githubusercontent.com/softmuneeb/app-links/main/links.json'))?.data?.Nomadly
  ) {
    return console.log('Service is paused because some ENV variable is missing')
  } else {
    // console.log('Service is on')
  }

  if (!db) return send(chatId, 'Bot is starting, please wait')
  if (!connect_reseller_working) {
    await tryConnectReseller()
    if (!connect_reseller_working) return send(chatId, 'Bot starting, please wait')
  }

  const nameOfChatId = await get(nameOf, chatId)
  const username = nameOfChatId || msg?.from?.username || nanoid()

  const blocked = await get(chatIdBlocked, chatId)
  if (blocked) return send(chatId, t.blockedUser, rem)

  if (!nameOfChatId) {
    set(nameOf, chatId, username)
    set(chatIdOf, username, chatId)
  }

  const freeLinks = await get(freeShortLinksOf, chatId)
  if (freeLinks === null || freeLinks === undefined) {
    set(freeShortLinksOf, chatId, FREE_LINKS)
  }

  let info = await get(state, chatId)
  const saveInfo = async (label, data) => {
    await set(state, chatId, label, data)
    info = await get(state, chatId)
  }

  const action = info?.action

  const trans = (key, ...args) => {
    const lang = info?.userLanguage || 'en';
    return translation(key, lang, ...args)
  };

  const user = trans('user')
  const t = trans('t')
  const u = trans('u')
  const bc = trans('bc')
  const k = trans('k')
  const aO = trans('aO')
  const admin = trans('admin')
  const payIn = trans('payIn')
  const payBank = trans('payBank')
  const hP = trans('hP')

  // actions
  const a = {
    // submenu
    submenu1: 'submenu1',
    submenu2: 'submenu2',

    // cPanel Plans SubMenu
    submenu3: 'submenu3',
    // Free Trial Actions
    freeTrial: 'freeTrial',
    getPlanNow: 'getPlanNow',
    domainAvailableContinue: 'domainAvailableContinue',
    continueWithDomainNameSBS: 'continueWithDomainNameSBS',
    nameserverSelectionSBS: 'nameserverSelectionSBS',
    proceedSearchAnotherDomain: 'proceedSearchAnotherDomain',
    confirmEmailBeforeProceedingSBS: 'confirmEmailBeforeProceedingSBS',

    // Plans
    starterPlan: 'starterPlan',
    businessPlan: 'businessPlan',
    proPlan: 'proPlan',

    // Plan Actions
    registerNewDomain: 'registerNewDomain',
    registerNewDomainFound: 'registerNewDomainFound',
    useExistingDomain: 'useExistingDomain',
    useExistingDomainFound: 'useExistingDomainFound',
    domainNotFound: 'domainNotFound',
    nameserverSelection: 'nameserverSelection',
    enterYourEmail: 'enterYourEmail',
    confirmEmailBeforeProceeding: 'confirmEmailBeforeProceeding',
    proceedWithEmail: 'proceedWithEmail',
    proceedWithPaymentProcess: 'proceedWithPaymentProcess',
    plansAskCoupon: 'plansAskCoupon',
    skipCoupon: 'skipCoupon',

    askDomainToUseWithShortener: 'askDomainToUseWithShortener',

    selectCurrencyToWithdraw: 'selectCurrencyToWithdraw',

    selectCurrencyToDeposit: 'selectCurrencyToDeposit',

    depositNGN: 'depositNGN',
    askEmailForNGN: 'askEmailForNGN',
    showDepositNgnInfo: 'showDepositNgnInfo',

    depositUSD: 'depositUSD',
    selectCryptoToDeposit: 'selectCryptoToDeposit',
    showDepositCryptoInfo: 'showDepositCryptoInfo',

    walletSelectCurrency: 'walletSelectCurrency',
    walletSelectCurrencyConfirm: 'walletSelectCurrencyConfirm',

    walletPayUsd: 'walletPayUsd',
    walletPayNgn: 'walletPayNgn',

    askCoupon: 'askCoupon',

    phoneNumberLeads: 'phoneNumberLeads',

    // buyLeads
    buyLeadsSelectCountry: 'buyLeadsSelectCountry',
    buyLeadsSelectSmsVoice: 'buyLeadsSelectSmsVoice',
    buyLeadsSelectArea: 'buyLeadsSelectArea',
    buyLeadsSelectAreaCode: 'buyLeadsSelectAreaCode',
    buyLeadsSelectCarrier: 'buyLeadsSelectCarrier',
    buyLeadsSelectCnam: 'buyLeadsSelectCnam',
    buyLeadsSelectAmount: 'buyLeadsSelectAmount',
    buyLeadsSelectFormat: 'buyLeadsSelectFormat',
    //validatePhoneNumbers
    validatorSelectCountry: 'validatorSelectCountry',
    validatorPhoneNumber: 'validatorPhoneNumber',
    validatorSelectSmsVoice: ' validatorSelectSmsVoice',
    validatorSelectCarrier: 'validatorSelectCarrier',
    validatorSelectCnam: 'validatorSelectCnam',
    validatorSelectAmount: 'validatorSelectAmount',
    validatorSelectFormat: 'validatorSelectFormat',

    // Short link
    redSelectUrl: 'redSelectUrl',
    redSelectRandomCustom: 'redSelectRandomCustom',
    redSelectProvider: 'redSelectProvider',
    redSelectCustomExt: 'redSelectCustomExt',

    // user setup
    addUserLanguage: 'addUserLanguage',
    updateUserLanguage: 'updateUserLanguage',
    askUserEmail: 'askUserEmail',
    askUserTerms: 'askUserTerms',
  }
  const firstSteps = [
    'block-user',
    'unblock-user',
    admin.messageUsers,

    'choose-subscription',
    user.wallet,
    a.phoneNumberLeads,

    a.submenu1,
    a.submenu2,
    // cPanel Plans SubMenu
    a.submenu3,
    'displayMainMenuButtons',
  ]
  const goto = {
    askCoupon: action => {
      send(chatId, t.askCoupon(info?.price), k.of([t.skip]))
      set(state, chatId, 'action', a.askCoupon + action)
    },
    'domain-pay': () => {
      const { domain, price, couponApplied, newPrice } = info
      couponApplied
        ? send(chatId, t.domainNewPrice(domain, price, newPrice), k.pay)
        : send(chatId, t.domainPrice(domain, price), k.pay)
      set(state, chatId, 'action', 'domain-pay')
    },
    'hosting-pay': () => {
      const payload = {
        domainName: info.website_name,
        domainPrice: info.price,
        existingDomain: info.existingDomain,
        couponDiscount: info.couponDiscount,
        totalPrice: info.totalPrice,
        couponApplied: info.couponApplied,
        hostingPrice: info.hostingPrice,
        newPrice: info.newPrice,
      }
      set(state, chatId, 'action', 'hosting-pay')
      send(chatId, hP.generateInvoiceText(payload), k.pay)
    },
    'choose-domain-to-buy': async () => {
      let text = ``
      if (await isSubscribed(chatId)) {
        const plan = await get(planOf, chatId)
        const available = (await get(freeDomainNamesAvailableFor, chatId)) || 0
        const s = available === 1 ? '' : 's'
        text =
          available <= 0
            ? ``
            : t.availablefreeDomain(plan, available, s)
      }
      set(state, chatId, 'action', 'choose-domain-to-buy')
      send(chatId, t.chooseDomainToBuy(text), bc)
    },
    askDomainToUseWithShortener: () => {
      set(state, chatId, 'action', a.askDomainToUseWithShortener)
      send(chatId, t.askDomainToUseWithShortener,  trans('yes_no'))
    },
    'plan-pay': () => {
      const { plan, price, couponApplied, newPrice } = info
      couponApplied
        ? send(chatId, t.planNewPrice(plan, price, newPrice), k.pay)
        : send(chatId, t.planPrice(plan, price), k.pay)
      set(state, chatId, 'action', 'plan-pay')
    },
    'choose-subscription': () => {
      set(state, chatId, 'action', 'choose-subscription')
      send(chatId, t.chooseSubscription, trans('chooseSubscription'))
    },
    'choose-url-to-shorten': async () => {
      set(state, chatId, 'action', 'choose-url-to-shorten')
      send(chatId, t.shortenedUrlLink, bc)
      adminDomains = await getPurchasedDomains(TELEGRAM_DOMAINS_SHOW_CHAT_ID)
    },
    'choose-domain-with-shorten': domains => {
      send(chatId, t.chooseDomainWithShortener, trans('show', domains))
      set(state, chatId, 'action', 'choose-domain-with-shorten')
    },
    'choose-link-type': () => {
      send(chatId, `Choose link type:`, trans('linkType'))
      set(state, chatId, 'action', 'choose-link-type')
    },
    'get-free-domain': () => {
      send(chatId, t.chooseFreeDomainText,  trans('yes_no'))
      set(state, chatId, 'action', 'get-free-domain')
    },

    'choose-domain-to-manage': async () => {
      const domains = await getPurchasedDomains(chatId)
      set(state, chatId, 'action', 'choose-domain-to-manage')
      send(chatId, t.chooseDomainToManage, trans('show', domains))
    },

    'select-dns-record-id-to-delete': () => {
      send(chatId, t.deleteDnsTxt, bc)
      set(state, chatId, 'action', 'select-dns-record-id-to-delete')
    },

    'confirm-dns-record-id-to-delete': () => {
      send(chatId, t.confirmDeleteDnsTxt,  trans('yes_no'))
      set(state, chatId, 'action', 'confirm-dns-record-id-to-delete')
    },

    'choose-dns-action': async () => {
      const domain = info?.domainToManage
      const { records, domainNameId } = await viewDNSRecords(domain)

      const toSave = records.map(({ dnszoneID, dnszoneRecordID, recordType, nsId, recordContent }) => ({
        dnszoneID,
        dnszoneRecordID,
        recordType,
        nsId,
        recordContent,
      }))
      const viewDnsRecords = records
        .map(
          ({ recordType, recordContent, nsId }, i) =>
            `${i + 1}.\t${recordType === 'NS' ? recordType + nsId : recordType === 'A' ? 'A Record' : recordType}:\t${recordContent || 'None'
            }`,
        )
        .join('\n')

      set(state, chatId, 'dnsRecords', toSave)

      set(state, chatId, 'domainNameId', domainNameId)
      set(state, chatId, 'action', 'choose-dns-action')
      send(chatId, `${t.viewDnsRecords.replaceAll('{{domain}}', domain)}\n${viewDnsRecords}`, trans('dns'))
    },

    'type-dns-record-data-to-add': recordType => {
      send(chatId, t.askDnsContent[recordType], bc)
      set(state, chatId, 'recordType', recordType)
      set(state, chatId, 'action', 'type-dns-record-data-to-add')
    },

    'select-dns-record-id-to-update': () => {
      send(chatId, t.updateDnsTxt, bc)
      set(state, chatId, 'action', 'select-dns-record-id-to-update')
    },
    'type-dns-record-data-to-update': (id, recordType) => {
      set(state, chatId, 'dnsRecordIdToUpdate', id)
      set(state, chatId, 'action', 'type-dns-record-data-to-update')
      send(chatId, t.askUpdateDnsContent[recordType])
    },

    'select-dns-record-type-to-add': () => {
      set(state, chatId, 'action', 'select-dns-record-type-to-add')
      send(chatId, t.addDnsTxt, trans('dnsRecordType'))
    },

    //
    //
    [admin.messageUsers]: () => {
      send(chatId, 'Enter message', bc)
      set(state, chatId, 'action', admin.messageUsers)
    },
    adminConfirmMessage: () => {
      send(chatId, 'Confirm?',  trans('yes_no'))
      set(state, chatId, 'action', 'adminConfirmMessage')
    },
    //
    //
    //

    [user.wallet]: async () => {
      set(state, chatId, 'action', user.wallet)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)
      send(chatId, t.wallet(usdBal, ngnBal), k.wallet)
    },
    //
    [a.selectCurrencyToDeposit]: () => {
      set(state, chatId, 'action', a.selectCurrencyToDeposit)
      send(chatId, t.selectCurrencyToDeposit, trans('payOpts'))
    },
    //
    [a.depositNGN]: () => {
      send(chatId, t.depositNGN, bc)
      set(state, chatId, 'action', a.depositNGN)
    },
    [a.askEmailForNGN]: () => {
      send(chatId, t.askEmailForNGN, bc)
      set(state, chatId, 'action', a.askEmailForNGN)
    },
    showDepositNgnInfo: async () => {
      const ref = nanoid()
      const { depositAmountNgn: ngn, email } = info

      log({ ref })
      set(chatIdOfPayment, ref, { chatId, ngnIn: ngn, endpoint: `/bank-wallet` })
      const { url, error } = await createCheckout(ngn, `/ok?a=b&ref=${ref}&`, email, username, ref)

      set(state, chatId, 'action', 'none')
      if (error) return send(chatId, error, trans('o'))
      console.log('showDepositNgnInfo', url)
      send(chatId, t.showDepositNgnInfo(ngn), payBank(url))
      return send(chatId, `Bank ₦aira + Card 🌐︎`, trans('o'))
    },
    //
    [a.depositUSD]: () => {
      send(chatId, t.depositUSD, bc)
      set(state, chatId, 'action', a.depositUSD)
    },
    [a.selectCryptoToDeposit]: () => {
      set(state, chatId, 'action', a.selectCryptoToDeposit)
      send(chatId, t.selectCryptoToDeposit, trans('k.of', trans('supportedCryptoViewOf')))
    },
    showDepositCryptoInfo: async () => {
      const ref = nanoid()
      const { amount, tickerView, userLanguage } = info
      const ticker = tickerOf[tickerView]
      if (BLOCKBEE_CRYTPO_PAYMENT_ON === 'true') {
        const { address, bb } = await getCryptoDepositAddress(ticker, chatId, SELF_URL, `/crypto-wallet?a=b&ref=${ref}&`)

        log({ ref })
        sendQrCode(bot, chatId, bb, userLanguage ?? 'en')
        set(chatIdOfPayment, ref, { chatId })
        set(state, chatId, 'action', 'none')
        const usdIn = await convert(amount, 'usd', ticker)
        send(chatId, t.showDepositCryptoInfo(usdIn, tickerView, address), trans('o'))
      } else {
        const tickerDyno = tickerOfDyno[tickerView]
        const redirect_url = `${SELF_URL}/dynopay/crypto-wallet`
        const meta_data = {
          "product_name": dynopayActions.walletFund,
          "refId" : ref
        }
        const { qr_code, address } = await getDynopayCryptoAddress(amount, tickerDyno, redirect_url, meta_data)
        await generateQr(bot, chatId, qr_code, userLanguage ?? 'en')
        set(chatIdOfDynopayPayment, ref, { chatId, action: dynopayActions.walletFund, address })
        set(state, chatId, 'action', 'none')
        const usdIn = await convert(amount, 'usd', ticker)
        send(chatId, t.showDepositCryptoInfo(usdIn, tickerView, address), trans('o'))
      }
    },

    //
    selectCurrencyToWithdraw: () => {
      send(chatId, t.comingSoonWithdraw)
    },
    //
    //
    walletSelectCurrency: async (plan = false) => {
      if (
        action.includes(a.buyLeadsSelectFormat) ||
        action.includes(a.validatorSelectFormat) ||
        action.includes(a.redSelectRandomCustom)
      ) {
        if (plan) {
          const { amount, totalPrice, couponApplied, newPrice } = info
          couponApplied
          ? send(chatId, t.buyLeadsNewPrice(amount, totalPrice, newPrice), trans('payOpts'))
          : send(chatId, t.buyLeadsPrice(amount, totalPrice), trans('payOpts'))
        } else {
          const { amount, price, couponApplied, newPrice } = info
          couponApplied
          ? send(chatId, t.buyLeadsNewPrice(amount, price, newPrice), trans('payOpts'))
          : send(chatId, t.buyLeadsPrice(amount, price), trans('payOpts'))
        }

      }

      set(state, chatId, 'action', a.walletSelectCurrency)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)
      send(chatId, t.walletSelectCurrency(usdBal, ngnBal), trans('payOpts'))
    },
    walletSelectCurrencyConfirm: async () => {
      const { price, couponApplied, newPrice, coin } = info
      const p = couponApplied ? newPrice : price

      let text = ''
      if (coin === u.ngn) text = t.confirmNgn(p, await usdToNgn(p))

      send(chatId, text + t.walletSelectCurrencyConfirm,  trans('yes_no'))
      set(state, chatId, 'action', a.walletSelectCurrencyConfirm)
    },
    //
    phoneNumberLeads: () => {
      send(chatId, t.phoneNumberLeads, k.phoneNumberLeads)
      set(state, chatId, 'action', a.phoneNumberLeads)
    },
    //
    //
    // buyLeads
    buyLeadsSelectCountry: () => {
      send(chatId, t.buyLeadsSelectCountry, k.buyLeadsSelectCountry)
      set(state, chatId, 'action', a.buyLeadsSelectCountry)
    },
    buyLeadsSelectSmsVoice: () => {
      send(chatId, t.buyLeadsSelectSmsVoice, k.buyLeadsSelectSmsVoice)
      set(state, chatId, 'action', a.buyLeadsSelectSmsVoice)
    },
    buyLeadsSelectArea: () => {
      send(chatId, t.buyLeadsSelectArea, k.buyLeadsSelectArea(info?.country))
      set(state, chatId, 'action', a.buyLeadsSelectArea)
    },
    buyLeadsSelectAreaCode: () => {
      send(
        chatId,
        t.buyLeadsSelectAreaCode,
        k.buyLeadsSelectAreaCode(info?.country, ['USA', 'Canada'].includes(info?.country) ? info?.area : 'Area Codes'),
      )
      set(state, chatId, 'action', a.buyLeadsSelectAreaCode)
    },
    buyLeadsSelectCarrier: () => {
      send(chatId, t.buyLeadsSelectCarrier, k.buyLeadsSelectCarrier(info?.country))
      set(state, chatId, 'action', a.buyLeadsSelectCarrier)
    },
    buyLeadsSelectCnam: () => {
      send(chatId, t.buyLeadsSelectCnam, k.buyLeadsSelectCnam)
      set(state, chatId, 'action', a.buyLeadsSelectCnam)
    },
    buyLeadsSelectAmount: () => {
      send(
        chatId,
        t.buyLeadsSelectAmount(buyLeadsSelectAmount[0], buyLeadsSelectAmount[buyLeadsSelectAmount.length - 1]),
        k.buyLeadsSelectAmount,
      )
      set(state, chatId, 'action', a.buyLeadsSelectAmount)
    },
    buyLeadsSelectFormat: () => {
      send(chatId, t.buyLeadsSelectFormat, k.buyLeadsSelectFormat)
      set(state, chatId, 'action', a.buyLeadsSelectFormat)
    },

    // validator
    validatorSelectCountry: () => {
      send(chatId, t.validatorSelectCountry, k.validatorSelectCountry)
      set(state, chatId, 'action', a.validatorSelectCountry)
    },

    validatorPhoneNumber: () => {
      send(chatId, t.validatorPhoneNumber, bc)
      set(state, chatId, 'action', a.validatorPhoneNumber)
    },

    validatorSelectSmsVoice: () => {
      send(chatId, t.validatorSelectSmsVoice(info?.phones?.length), k.validatorSelectSmsVoice)
      set(state, chatId, 'action', a.validatorSelectSmsVoice)
    },

    validatorSelectCarrier: () => {
      send(chatId, t.validatorSelectCarrier, k.validatorSelectCarrier(info?.country))
      set(state, chatId, 'action', a.validatorSelectCarrier)
    },

    validatorSelectCnam: () => {
      send(chatId, t.validatorSelectCnam, k.validatorSelectCnam)
      set(state, chatId, 'action', a.validatorSelectCnam)
    },

    validatorSelectAmount: () => {
      send(
        chatId,
        t.validatorSelectAmount(validatorSelectAmount[0], validatorSelectAmount[validatorSelectAmount.length - 1]),
        k.validatorSelectAmount,
      )
      set(state, chatId, 'action', a.validatorSelectAmount)
    },

    validatorSelectFormat: () => {
      send(chatId, t.validatorSelectFormat, k.validatorSelectFormat)
      set(state, chatId, 'action', a.validatorSelectFormat)
    },

    // short link
    redSelectUrl: async () => {
      set(state, chatId, 'action', a.redSelectUrl)
      send(chatId, t.redSelectUrl, bc)
    },

    redSelectRandomCustom: () => {
      send(chatId, t.redSelectRandomCustom, trans('k.redSelectRandomCustom'))
      set(state, chatId, 'action', a.redSelectRandomCustom)
    },

    redSelectProvider: () => {
      send(chatId, trans('t.redSelectProvider'), trans('k.redSelectProvider'))
      set(state, chatId, 'action', a.redSelectProvider)
    },

    redSelectCustomExt: () => {
      send(chatId, t.redSelectCustomExt, bc)
      set(state, chatId, 'action', a.redSelectCustomExt)
    },

    submenu1: () => {
      set(state, chatId, 'action', a.submenu1)
      send(chatId, t.select, trans('k.of', [user.redSelectUrl, user.urlShortener, user.viewShortLinks]))
    },
    submenu2: () => {
      set(state, chatId, 'action', a.submenu2)
      send(chatId, t.select, trans('k.of', [user.buyDomainName, user.viewDomainNames, user.dnsManagement]))
    },

    // cPanel Plans SubMenu
    submenu3: () => {
      saveInfo('username', username)
      set(state, chatId, 'action', a.submenu3)
      send(chatId, t.selectPlan, trans('k.of', [[user.freeTrial, user.starterPlan], [user.proPlan, user.businessPlan], user.contactSupport]))
    },

    displayEmailValidationError: () => {
      send(chatId, t.trialPlanInValidEmail, k.of([[t.backButton]]))
    },

    //free Trial Package
    freeTrialMenu: () => {
      set(state, chatId, 'action', a.freeTrial)
      send(chatId, t.selectedTrialPlan, k.of([user.freeTrialMenuButton, user.contactSupport]))
    },
    freeTrial: () => {
      set(state, chatId, 'action', a.freeTrial)
      send(chatId, t.freeTrialPlanSelected(info.hostingType), k.of([[user.getFreeTrialPlanNow, t.backButton]]))
    },
    getFreeTrialPlanNow: () => {
      set(state, chatId, 'action', a.getPlanNow)
      saveInfo('plan', 'Freedom Plan')
      send(chatId, t.getFreeTrialPlan, k.of([[user.backToFreeTrial]]))
    },
    continueWithDomainNameSBS: (websiteName) => {
      set(state, chatId, 'action', a.domainAvailableContinue)
      saveInfo('website_name', websiteName)
      saveInfo('existingDomain', false)
      send(chatId, t.trialPlanContinueWithDomainNameSBSMatched(websiteName), k.of([[user.continueWithDomainNameSBS(websiteName)], [user.searchAnotherDomain], [t.backButton]]))
    },
    nameserverSelectionSBS: (websiteName) => {
      set(state, chatId, 'action', a.nameserverSelectionSBS)
      const actions = [[user.privHostNS], [user.cloudflareNS], [t.backButton]];
      send(chatId, t.trialPlanNameserverSelection(websiteName), k.of(actions))
    },
    proceedContinueWithDomainNameSBS: () => {
      set(state, chatId, 'action', a.continueWithDomainNameSBS)
      send(chatId, t.trialPlanDomainNameMatched, k.of([[t.backButton]]))
    },
    confirmEmailBeforeProceedingSBS: (email) => {
      saveInfo('email', email)
      set(state, chatId, 'action', a.confirmEmailBeforeProceedingSBS)
      send(chatId, t.confirmEmailBeforeProceedingSBS(email), k.of([[t.yesProceedWithThisEmail(email)], [t.backButton]]))
    },
    sendcPanelCredentialsAsEmailToUser: async () => {
      try {
        send(chatId, t.trialPlanActivationConfirmation)
        send(chatId, t.trialPlanActivationInProgress, trans('o'))
        return await registerDomainAndCreateCpanel(send, info, trans('o'), state)
      } catch (error) {
        console.error('Error in sending messages or email:', error)
      }
    },


    // Step 1: Select Plan
    selectPlan: plan => {
      let planName = 'Starter Plan';

      if (plan === a.businessPlan) {
        planName = 'Business Plan';
      } else if (plan === a.proPlan) {
        planName = 'Pro Plan';
      }

      saveInfo('plan', planName)
      set(state, chatId, 'action', plan)
      const message = hP.generatePlanText(info.hostingType, plan);

      let actions = [[user.buyStarterPlan], [user.viewProPlan, user.viewBusinessPlan], [user.backToHostingPlans]];
      if (plan === a.proPlan) {
        actions = [[user.buyProPlan], [user.viewStarterPlan, user.viewBusinessPlan], [user.backToHostingPlans]];
      } else if (plan === a.businessPlan) {
        actions = [[user.buyBusinessPlan], [user.viewStarterPlan, user.viewProPlan], [user.backToHostingPlans]];
      }

      send(chatId, message, k.of(actions))
    },

    // Step 1.1: View Plan
    viewPlan: plan => {
      set(state, chatId, 'action', plan)
      const message = hP.generatePlanText(info.hostingType, plan);
      send(chatId, message, bc)
    },

    // Step 2: Buy Plan
    buyPlan: plan => {
      set(state, chatId, 'action', plan)
      console.log("buyPlan", plan)
      const message = hP.generatePlanStepText("buyText");
      let actions = [user.registerANewDomain, user.useExistingDomain, [user.backToStarterPlanDetails]];

      if (plan === a.businessPlan) {
        actions = [user.registerANewDomain, user.useExistingDomain, [user.backToBusinessPlanDetails]];
      } else if (plan === a.proPlan) {
        actions = [user.registerANewDomain, user.useExistingDomain, [user.backToProPlanDetails]];
      }

      send(chatId, message, k.of(actions))
    },

    // Step 2.1: Register New Domain
    registerNewDomain: () => {
      set(state, chatId, 'action', a.registerNewDomain)
      saveInfo('existingDomain', false)

      const message = hP.generatePlanStepText("registerNewDomainText");
      send(chatId, message, bc)
    },

    // Step 2.2: Register New Domain - Found
    registerNewDomainFound: (websiteName, price) => {
      set(state, chatId, 'action', a.registerNewDomainFound)
      saveInfo('website_name', websiteName)
      const domainFoundText = hP.generateDomainFoundText(websiteName, price);
      send(chatId, domainFoundText, k.of([[user.continueWithDomain(websiteName)], [user.searchAnotherDomain]]))
    },

    // Step 2.3: Use Existing Domain
    useExistingDomain: () => {
      set(state, chatId, 'action', a.useExistingDomain)
      saveInfo('existingDomain', true)
      const message = hP.generatePlanStepText("useExistingDomainText");
      send(chatId, message, bc)
    },

    // Step 2.4: Use Existing Domain - Found
    useExistingDomainFound: (websiteName) => {
      set(state, chatId, 'action', a.useExistingDomainFound)
      saveInfo('website_name', websiteName)
      send(chatId, hP.generateExistingDomainText(websiteName), k.of([[user.continueWithDomain(websiteName)], [user.searchAnotherDomain]]))
    },

    domainNotFound: (websiteName) => {
      set(state, chatId, 'action', a.domainNotFound)
      send(chatId, hP.domainNotFound(websiteName), bc)
    },

    // Step 3: Nameserver Selection
    nameserverSelection: (websiteName) => {
      set(state, chatId, 'action', a.nameserverSelection)
      const actions = [[user.privHostNS], [user.cloudflareNS]];
      send(chatId, hP.nameserverSelectionText(websiteName), k.of(actions))
    },

    // Step 4: Enter your email
    enterYourEmail: () => {
      set(state, chatId, 'action', a.enterYourEmail)
      send(chatId, hP.generatePlanStepText('enterYourEmail'), bc)
    },

    // Step 4.1: Confirm Email
    confirmEmailBeforeProceeding: (email) => {
      saveInfo('email', email)
      set(state, chatId, 'action', a.confirmEmailBeforeProceeding)
      send(chatId, hP.confirmEmailBeforeProceeding(email), k.of([t.yesProceedWithThisEmail(email)]))
    },

    // Step 4.2: Proceed with Email
    proceedWithEmail: (domainName, domainPrice) => {
      let hostingPrice = parseFloat(HOSTING_STARTER_PLAN_PRICE)

      if (info.plan === 'Business Plan') {
        hostingPrice = parseFloat(HOSTING_BUSINESS_PLAN_PRICE)
      } else if (info.plan === 'Pro Plan') {
        hostingPrice = parseFloat(HOSTING_PRO_PLAN_PRICE)
      }

      if (info.existingDomain) {
        domainPrice = 0
      }
      const totalPrice = domainPrice + hostingPrice;

      saveInfo("couponApplied", false);
      saveInfo("couponDiscount", 0);
      saveInfo("hostingPrice", hostingPrice);
      saveInfo("totalPrice", totalPrice);

      const payload = {
        domainName: domainName,
        domainPrice: domainPrice,
        hostingPrice: hostingPrice,
        couponDiscount: 0,
        totalPrice: totalPrice,
        existingDomain: info.existingDomain
      }

      set(state, chatId, 'action', a.proceedWithEmail)
      send(chatId, hP.generateInvoiceText(payload), k.of([t.proceedWithPayment]),
      )
    },

    // Step 5: Ask Coupon
    plansAskCoupon: action => {
      saveInfo('couponApplied', false)
      saveInfo('couponDiscount', 0)
      send(chatId, t.planAskCoupon, k.of([t.skip]))
      set(state, chatId, 'action', a.askCoupon + action)
    },

    // Step 5.1: Skip Coupon
    skipCoupon: (action) => {
      set(state, chatId, 'action', a.skipCoupon)
      saveInfo('couponApplied', false)
      saveInfo('couponDiscount', 0)
      goto[action]()
    },

    // Step 6: Proceed with Payment
    proceedWithPaymentProcess: async () => {
      send(chatId, hP.generatePlanStepText('paymentConfirmation'), k.of([t.iHaveSentThePayment]))
    },

    // Step 6.1: I have sent the payment
    iHaveSentThePayment: async () => {
      set(state, chatId, 'action', a.iHaveSentThePayment)
      send(chatId, hP.generatePlanStepText('paymentSuccess'), k.of([t.iHaveSentThePayment]))
    },
    userLanguage : () => {
      set(state, chatId, 'action', a.addUserLanguage)
      return send(chatId, trans('l.askPreferredLanguage') , trans('languageMenu'))
    },
    askUserEmail : () => {
      set(state, chatId, 'action', a.askUserEmail)
      return send(chatId, trans('l.askUserEmail'), trans('k.of', [[trans('t.backButton')]]))    
    },
    askUserTerms: () => {
      set(state, chatId, 'action', a.askUserTerms)
      send(chatId, trans('l.termsAndCond'), trans('termsAndConditionType', info?.userLanguage ?? 'en'))
      setTimeout(() => {
        return send(chatId, trans('l.acceptTermMsg'), trans('k.of', [[trans('l.acceptTermButton')], [trans('l.declineTermButton')], [trans('t.backButton')]]))
      },1000)
      return
    }
  }

  const walletOk = {
    'plan-pay': async coin => {
      set(state, chatId, 'action', 'none')

      const plan = info?.plan
      const lang = info?.userLanguage || 'en'
      const name = await get(nameOf, chatId)
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const wallet = await get(walletOf, chatId)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      if (coin === u.usd) {
        const priceUsd = price
        if (usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
        set(payments, nanoid(), `Wallet,Plan,${plan},$${priceUsd},${chatId},${name},${new Date()}`)
        const usdOut = (wallet?.usdOut || 0) + priceUsd
        await set(walletOf, chatId, 'usdOut', usdOut)
      } else {
        const priceNgn = await usdToNgn(price)
        if (ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
        set(payments, nanoid(), `Wallet,Plan,${plan},$${price},${chatId},${name},${new Date()},${priceNgn} NGN`)
        const ngnOut = isNaN(wallet?.ngnOut) ? 0 : Number(wallet?.ngnOut)
        await set(walletOf, chatId, 'ngnOut', ngnOut + priceNgn)
      }

      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
      subscribePlan(planEndingTime, freeDomainNamesAvailableFor, planOf, chatId, plan, bot, lang)
    },

    'domain-pay': async coin => {
      set(state, chatId, 'action', 'none')
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const wallet = await get(walletOf, chatId)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))

      // buy domain
      const domain = info?.domain
      const lang = info?.userLanguage ?? 'en'
      const error = await buyDomainFullProcess(chatId, lang, domain)
      if (error) return
      const name = await get(nameOf, chatId)

      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,Domain,${domain},$${priceUsd},${chatId},${name},${new Date()}`)
        const usdOut = (wallet?.usdOut || 0) + priceUsd
        await set(walletOf, chatId, 'usdOut', usdOut)
      }
      if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,Domain,${domain},$${priceUsd},${chatId},${name},${new Date()},${priceNgn} NGN`)
        const ngnOut = isNaN(wallet?.ngnOut) ? 0 : Number(wallet?.ngnOut)
        await set(walletOf, chatId, 'ngnOut', ngnOut + priceNgn)
      }
      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
    },
    'hosting-pay': async coin => {
      set(state, chatId, 'action', 'none')
      const price = info?.couponApplied ? info?.newPrice : info?.totalPrice
      const wallet = await get(walletOf, chatId)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))

      await registerDomainAndCreateCpanel(send, info, trans('o'), state)

      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,Domain,${info.domain},$${priceUsd},${chatId},${new Date()}`)
        const usdOut = (wallet?.usdOut || 0) + priceUsd
        await set(walletOf, chatId, 'usdOut', usdOut)
      }
      if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,Domain,${info.domain},$${priceUsd},${chatId},${new Date()},${priceNgn} NGN`)
        const ngnOut = isNaN(wallet?.ngnOut) ? 0 : Number(wallet?.ngnOut)
        await set(walletOf, chatId, 'ngnOut', ngnOut + priceNgn)
      }
      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
    },
    [a.buyLeadsSelectFormat]: async coin => {
      set(state, chatId, 'action', 'none')
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const wallet = await get(walletOf, chatId)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))

      let cc = countryCodeOf[info?.country]
      let country = info?.country
      let cnam = info?.country === 'USA' ? info?.cnam : false

      let area = ['USA', 'Canada'].includes(info?.country) ? info?.area : 'Area Codes'
      let areaCodes

      if (['Australia'].includes(info?.country)) {
        areaCodes = ['4']
      } else {
        areaCodes =
          info?.areaCode === 'Mixed Area Codes' ? _buyLeadsSelectAreaCode(info?.country, area) : [info?.areaCode]
      }

      const format = info?.format
      const l = format === buyLeadsSelectFormat[0]

      // buy leads
      send(chatId, t.validatorBulkNumbersStart, trans('o'))
      const leadsAmount = info?.amount
      const lang = info?.userLanguage ?? 'en'
      const res = await validateBulkNumbers(info?.carrier, info?.amount, cc, areaCodes, cnam, bot, chatId, lang)
      if (!res) return send(chatId, t.buyLeadsError)

      send(chatId, t.buyLeadsSuccess(info?.amount)) // send success message

      cc = '+' + cc
      const re = cc === '+1' ? '' : '0'
      const file1 = 'leads.txt'
      fs.writeFile(file1, res.map(a => (l ? a[0].replace(cc, re) : a[0])).join('\n'), () => {
        bot?.sendDocument(chatId, file1)
      })

      if (cnam) {
        const file2 = 'leads_with_cnam.txt'
        fs.writeFile(file2, res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[3]).join('\n'), () => {
          bot?.sendDocument(chatId, file2)
          bot?.sendDocument(TELEGRAM_ADMIN_CHAT_ID, file2)
        })
      } else {
        if (country !== 'USA') {
          const file2 = 'leads_with_carriers.txt'
          fs.writeFile(file2, res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[1]).join('\n'), () => {
            bot?.sendDocument(chatId, file2)
            bot?.sendDocument(TELEGRAM_ADMIN_CHAT_ID, file2)
          })
        }
      }

      {
        const file2 = 'leads_with_carriers_and_time.txt'
        chatId === 6687923716 &&
        fs.writeFile(
          file2,
          res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[1] + ' ' + a[2]).join('\n'),
          () => bot?.sendDocument(chatId, file2),
        )
      }
      const name = await get(nameOf, chatId)

      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,Phone Leads,${leadsAmount} leads,$${priceUsd},${chatId},${name},${new Date()}`)
        const usdOut = (wallet?.usdOut || 0) + priceUsd
        await set(walletOf, chatId, 'usdOut', usdOut)
      } else if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,Phone Leads,${leadsAmount} leads,$${priceUsd},${chatId},${name},${new Date()},${priceNgn} NGN`)
        const ngnOut = isNaN(wallet?.ngnOut) ? 0 : Number(wallet?.ngnOut)
        await set(walletOf, chatId, 'ngnOut', ngnOut + priceNgn)
      } else {
        return send(chatId, 'Some Issue')
      }
      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
    },

    [a.validatorSelectFormat]: async coin => {
      set(state, chatId, 'action', 'none')
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const wallet = await get(walletOf, chatId)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))

      let cc = countryCodeOf[info?.country]
      let country = info?.country
      let cnam = info?.country === 'USA' ? info?.cnam : false

      const format = info?.format
      const l = format === validatorSelectFormat[0]

      // buy leads
      send(chatId, t.validatorBulkNumbersStart, trans('o')) // main keyboard view
      const phones = info?.phones?.slice(0, info?.amount)
      const leadsAmount = info?.amount
      const res = await validatePhoneBulkFile(info?.carrier, phones, cc, cnam, bot, chatId)
      if (!res) return send(chatId, t.validatorError)

      send(chatId, t.validatorSuccess(info?.amount, res.length)) // send success message

      cc = '+' + cc
      const re = cc === '+1' ? '' : '0'
      const file1 = 'leads.txt'
      fs.writeFile(file1, res.map(a => (l ? a[0].replace(cc, re) : a[0])).join('\n'), () => {
        bot?.sendDocument(chatId, file1).catch()
      })

      if (cnam) {
        const file2 = 'leads_with_cnam.txt'
        fs.writeFile(file2, res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[3]).join('\n'), () => {
          bot?.sendDocument(chatId, file2).catch()
          bot?.sendDocument(TELEGRAM_ADMIN_CHAT_ID, file2).catch()
        })
      } else {
        if (country !== 'USA') {
          const file2 = 'leads_with_carriers.txt'
          fs.writeFile(file2, res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[1]).join('\n'), () => {
            bot?.sendDocument(chatId, file2).catch()
            bot?.sendDocument(TELEGRAM_ADMIN_CHAT_ID, file2).catch()
          })
        }
      }

      {
        const file2 = 'leads_with_carriers_and_time.txt'
        chatId === 6687923716 &&
        fs.writeFile(
          file2,
          res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[1] + ' ' + a[2]).join('\n'),
          () => bot?.sendDocument(chatId, file2).catch(),
        )
      }
      const name = await get(nameOf, chatId)
      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,Validate Leads,${leadsAmount} leads,$${priceUsd},${chatId},${name},${new Date()}`)
        const usdOut = (wallet?.usdOut || 0) + priceUsd
        await set(walletOf, chatId, 'usdOut', usdOut)
      } else if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,Validate Leads,${leadsAmount} leads,$${priceUsd},${chatId},${name},${new Date()},${priceNgn} NGN`)
        const ngnOut = isNaN(wallet?.ngnOut) ? 0 : Number(wallet?.ngnOut)
        await set(walletOf, chatId, 'ngnOut', ngnOut + priceNgn)
      } else {
        return send(chatId, 'Some Issue')
      }
      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
    },
    [a.redSelectProvider]: async coin => {
      set(state, chatId, 'action', 'none')
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const wallet = await get(walletOf, chatId)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      const name = await get(nameOf, chatId)
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      let _shortUrl
      try {
        const { url } = info
        const slug = nanoid()
        const __shortUrl = `${SELF_URL}/${slug}`
        _shortUrl = await createShortBitly(__shortUrl)
        const shortUrl = __shortUrl.replaceAll('.', '@').replace('https://', '')
        increment(totalShortLinks)
        set(maskOf, shortUrl, _shortUrl)
        set(fullUrlOf, shortUrl, url)
        set(linksOf, chatId, shortUrl, url)
        send(chatId, _shortUrl, trans('o'))
        set(state, chatId, 'action', 'none')
      } catch (error) {
        send(TELEGRAM_DEV_CHAT_ID, error.message)
        set(state, chatId, 'action', 'none')
        return send(chatId, t.redIssueUrlBitly, trans('o'))
      }

      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,Bit.ly Link,${_shortUrl},$${priceUsd},${chatId},${name},${new Date()}`)
        const usdOut = (wallet?.usdOut || 0) + priceUsd
        await set(walletOf, chatId, 'usdOut', usdOut)
      } else if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,Bit.ly Link,${_shortUrl},$${priceUsd},${chatId},${name},${new Date()},${priceNgn} NGN`)
        const ngnOut = isNaN(wallet?.ngnOut) ? 0 : Number(wallet?.ngnOut)
        await set(walletOf, chatId, 'ngnOut', ngnOut + priceNgn)
      } else {
        return send(chatId, 'Some Issue')
      }
      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
    },
  }

  const goBack = () => {
    const lastStep = info?.history[info?.history?.length - 1]

    saveInfo('history', info?.history.slice(0, -1)) // rem last elem

    goto[lastStep]()
  }

  if (message === '/start') {
    set(state, chatId, 'action', 'none')

    if (isAdmin(chatId)) return send(chatId, 'Hello, Admin! Please select an option:', aO)

    const freeLinks = await get(freeShortLinksOf, chatId)
    if (!info?.hasAcceptedTerms) {
      return goto.userLanguage()
    }
    if (freeLinks === undefined || freeLinks > 0) return send(chatId, t.welcomeFreeTrial, trans('o'))

    return send(chatId, t.welcome, trans('o'))
  }

  if (message === user.changeSetting) {
    set(state, chatId, 'action', a.updateUserLanguage)
    return send(chatId, trans('l.askPreferredLanguage') , trans('languageMenu'))
  }
  //
  if (message === t.cancel || (firstSteps.includes(action) && message === t.back)) {
    set(state, chatId, 'action', 'none')
    return send(chatId, t.userPressedBtn(message), isAdmin(chatId) ? aO : trans('o'))
  }
  //
  if (message === admin.blockUser) {
    if (!isAdmin(chatId)) return send(chatId, 'not authorized')
    set(state, chatId, 'action', 'block-user')
    return send(chatId, t.blockUser, bc)
  }
  if (action === 'block-user') {
    const userToBlock = message
    const chatIdToBlock = await get(chatIdOf, userToBlock)
    if (!chatIdToBlock) return send(chatId, t.userToBlock(userToBlock))

    set(state, chatId, 'action', 'none')
    set(chatIdBlocked, chatIdToBlock, true)
    return send(chatId, t.userBlocked(userToBlock), aO)
  }
  //
  if (message === admin.unblockUser) {
    if (!isAdmin(chatId)) return send(chatId, 'not authorized')
    set(state, chatId, 'action', 'unblock-user')
    return send(chatId, t.unblockUser, bc)
  }
  if (action === 'unblock-user') {
    const userToUnblock = message
    const chatIdToUnblock = await get(chatIdOf, userToUnblock)
    if (!chatIdToUnblock) return send(chatId, `User ${userToUnblock} not found`, bc)

    set(state, chatId, 'action', 'none')
    set(chatIdBlocked, chatIdToUnblock, false)
    return send(chatId, `User ${userToUnblock} has been unblocked.`, aO)
  }
  //
  if (message === admin.messageUsers) {
    if (!isAdmin(chatId)) return send(chatId, 'not authorized')
    return goto[admin.messageUsers]()
  }
  if (action === admin.messageUsers) {
    const fileId = msg?.photo?.[0]?.file_id
    set(state, chatId, 'messageContent', fileId || message)
    set(state, chatId, 'messageMethod', fileId ? 'sendPhoto' : 'sendMessage')
    return goto.adminConfirmMessage()
  }
  if (action === 'adminConfirmMessage') {
    if (message === t.back || message === t.no) return goto[admin.messageUsers]()
    if (message !== t.yes) return send(chatId, t.what)

    set(state, chatId, 'action', 'none')
    sendMessageToAllUsers(bot, info?.messageContent, info?.messageMethod, nameOf, chatId)
    return send(chatId, 'Sent to all users', aO)
  }
  if (action === a.addUserLanguage) {
    const language = message
    const supportedLanguages = trans('supportedLanguages')
    const validLanguage = supportedLanguages[language]
    if (!validLanguage) return send(chatId, trans('l.askValidLanguage'), trans('languageMenu') )
    info.userLanguage = validLanguage
    send(chatId, trans('l.welcomeMessage'))
    set(state, chatId, 'userLanguage', validLanguage)
    setTimeout(() => {
      return  goto.askUserEmail()
    },500)
    return
  }

  if (action === a.updateUserLanguage) {
    const language = message
    const supportedLanguages = trans('supportedLanguages')
    const validLanguage = supportedLanguages[language]
    if (!validLanguage) return send(chatId, trans('l.askValidLanguage'), trans('languageMenu') )
    info.userLanguage = validLanguage
    set(state, chatId, 'userLanguage', validLanguage)
    set(state, chatId, 'action', 'none')
    return send(chatId, trans('t.welcome'), trans('o')) 
  }

  if (action === a.askUserEmail) {
    if (message === trans('t.backButton')) return goto.userLanguage();
    const email = message;
    if (!isValidEmail(message)) {
      return send(chatId, hP.generatePlanStepText('invalidEmail'), trans('k.of', [[trans('t.backButton')]]))
    }
    set(state, chatId, 'userEmail', email)
    send(chatId, trans('l.processUserEmail'))
    setTimeout(() => {
      send(chatId, trans('l.confirmUserEmail'))
      return goto.askUserTerms()
    },1000)
    return
  }

  if (action === a.askUserTerms) {
    if (message === trans('t.backButton')) return goto.askUserEmail();
    if (message === trans('l.viewTermsAgainButton')) return goto.askUserTerms()
    if (message === trans('l.exitSetupButton')) {
      set(state, chatId, 'action', 'none')
      return send(chatId, trans('l.userExitMsg'), rem)
    }
    if (message === trans('l.acceptTermButton')) {
      set(state, chatId, 'hasAcceptedTerms', true)
      send(chatId, trans('l.acceptedTermsMsg'))
      setTimeout(async () => {
        const freeLinks = await get(freeShortLinksOf, chatId)
        set(state, chatId, 'action', 'none')
        if (freeLinks === undefined || freeLinks > 0) return send(chatId, t.welcomeFreeTrial, trans('o'))
        return send(chatId, t.welcome, trans('o'))      
      },1000)
      return
    }
    return send(chatId, trans('l.declinedTermsMsg'),  trans('k.of', [[trans('l.viewTermsAgainButton')], [trans('l.exitSetupButton')], [trans('t.backButton')]]))
  }

  // cPanel Plans Events Handlers
  if ([user.cPanelWebHostingPlans, user.pleskWebHostingPlans].includes(message)) {
    const hostingType = message === user.cPanelWebHostingPlans ? 'cPanel' : 'Plesk';
    saveInfo('hostingType', hostingType)
    return goto.submenu3()
  }

  if (message === user.contactSupport) {
    send(chatId, t.support)
    return
  }

  // Free Plan
  if (message === user.freeTrial) {
    if (await checkFreeTrialTaken(state, chatId) === 'already-used') return send(chatId, t.trialAlreadyUsed)
    return goto.freeTrialMenu()
  }

  if (action === a.freeTrial) {
    if (message === t.back) return goto.submenu3()
    if (message === t.backButton) return goto.freeTrialMenu()
    if (message === user.freeTrialMenuButton) return goto.freeTrial()
    if (message === user.getFreeTrialPlanNow) return goto.getFreeTrialPlanNow()
  }

  if (action === a.getPlanNow) {
    if (message === user.backToFreeTrial) return goto.freeTrial()

    if (!message.endsWith('.sbs') && message) {
       return send(chatId, t.trialPlanGetNowInvalidDomain, k.of([[user.backToFreeTrial]]))
    }

    const { modifiedDomain, price, domainType, chatMessage } = await planGetNewDomain(message, chatId, send, saveInfo, info.hostingType,false);

    if (modifiedDomain === null || price === null) {
      return send(chatId, chatMessage)
    }

    if (domainType === 'Premium') {
      return send(chatId, t.trialPlanSBSDomainIsPremium)
    }

    return goto.continueWithDomainNameSBS(modifiedDomain)
  }

  if (action === a.domainAvailableContinue) {
    if (message === t.backButton || message === user.searchAnotherDomain) return goto.getFreeTrialPlanNow()
    if ((message === user.continueWithDomainNameSBS(info.website_name))) return goto.nameserverSelectionSBS(info.website_name)
  }

  if(action === a.nameserverSelectionSBS) {
    if (message === t.backButton) return goto.continueWithDomainNameSBS(info.website_name)
    if (message === user.privHostNS || message === user.cloudflareNS) {
      let nameserver = message === user.privHostNS ? 'privhost' : 'cloudflare'
      saveInfo('nameserver', nameserver)
    }
    return goto.proceedContinueWithDomainNameSBS()
  }

  if (action === a.continueWithDomainNameSBS) {
    if (message === t.backButton) return goto.nameserverSelectionSBS(info.website_name)
    if (!isEmail(message)) return goto.displayEmailValidationError()
    return goto.confirmEmailBeforeProceedingSBS(message)
  }

  if (action === a.confirmEmailBeforeProceedingSBS) {
    if (message === t.backButton) return goto.proceedContinueWithDomainNameSBS()
    if (message === t.yesProceedWithThisEmail(info.email)) return goto.sendcPanelCredentialsAsEmailToUser()
  }


  // Starter Plan
  if (message === user.starterPlan) {
    return goto.selectPlan(a.starterPlan)
  }

  if (action === a.starterPlan) {
    if (message === user.backToHostingPlans) return goto.submenu3()
    if (message === user.buyStarterPlan) return goto.buyPlan(action)
    if (message === user.backToStarterPlanDetails) return goto.selectPlan(a.starterPlan)
    if (message === user.registerANewDomain) return goto.registerNewDomain()
    if (message === user.useExistingDomain) return goto.useExistingDomain()
    if (message === user.viewProPlan) return goto.selectPlan(a.proPlan)
    if (message === user.viewBusinessPlan) return goto.selectPlan(a.businessPlan)
  }


  // Business Plan
  if (message === user.businessPlan) {
    return goto.selectPlan(a.businessPlan)
  }

  if (action === a.businessPlan) {
    if (message === user.backToHostingPlans) return goto.submenu3()
    if (message === user.buyBusinessPlan) return goto.buyPlan(action)
    if (message === user.backToBusinessPlanDetails) return goto.selectPlan(a.businessPlan)
    if (message === user.registerANewDomain) return goto.registerNewDomain()
    if (message === user.useExistingDomain) return goto.useExistingDomain()
    if (message === user.viewStarterPlan) return goto.selectPlan(a.starterPlan)
    if (message === user.viewProPlan) return goto.selectPlan(a.proPlan)
  }


  // Pro Plan
  if (message === user.proPlan) {
    return goto.selectPlan(a.proPlan)
  }

  if (action === a.proPlan) {
    if (message === user.backToHostingPlans) return goto.submenu3()
    if (message === user.buyProPlan) return goto.buyPlan(action)
    if (message === user.backToProPlanDetails) return goto.selectPlan(a.proPlan)
    if (message === user.registerANewDomain) return goto.registerNewDomain()
    if (message === user.useExistingDomain) return goto.useExistingDomain()
    if (message === user.viewBusinessPlan) return goto.selectPlan(a.businessPlan)
    if (message === user.viewStarterPlan) return goto.selectPlan(a.starterPlan)
  }


  if (action === a.registerNewDomain) {
    if (message === t.back) return goto.buyPlan(a.starterPlan)
    send(chatId, t.checkingDomainAvail)
    const { modifiedDomain, price } = await planGetNewDomain(message, chatId, send, saveInfo, info.hostingType);
    if (modifiedDomain === null || price === null) return
    return goto.registerNewDomainFound(modifiedDomain, price)
  }

  if (action === a.useExistingDomain) {
    if (message === t.back) return goto.submenu3()
    send(chatId, t.checkingExistingDomainAvail)
    let modifiedDomain = removeProtocolFromDomain(message)
    const { available, chatMessage } = await planCheckExistingDomain(modifiedDomain, info.hostingType)
    if (!available) {
      send(chatId, chatMessage)
      return goto.domainNotFound(modifiedDomain)
    }

    return goto.useExistingDomainFound(modifiedDomain)
  }

  if (action === a.domainNotFound) {
    if (message === t.back) return goto.buyPlan(a.starterPlan)
    if (message === user.searchAnotherDomain) return goto.registerNewDomain()
    if (message === user.continueWithDomain(info.website_name)) return goto.enterYourEmail()
  }

  if (action === a.registerNewDomainFound) {
    if (message === t.back || message === user.searchAnotherDomain) return goto.registerNewDomain()
    if (message === user.continueWithDomain(info.website_name)) {
      await saveInfo('continue_domain_last_state', 'registerNewDomain')
      return goto.nameserverSelection(info.website_name)
    }
  }

  if (action === a.useExistingDomainFound) {
    if (message === t.back || message === user.searchAnotherDomain) return goto.useExistingDomain()
    if (message === user.continueWithDomain(info.website_name)) {
      await saveInfo('continue_domain_last_state', 'useExistingDomain')
      return goto.nameserverSelection(info.website_name)
    }
  }

  if (action === a.nameserverSelection) {
    if (message === t.back) {
      if (info?.continue_domain_last_state === 'registerNewDomain') return goto.registerNewDomainFound(info.website_name)
      else if (info?.continue_domain_last_state === 'useExistingDomain') return goto.useExistingDomainFound(info.website_name)
    }

    if (message === user.privHostNS || message === user.cloudflareNS) {
      let nameserver = message === user.privHostNS ? 'privhost' : 'cloudflare'
      saveInfo('nameserver', nameserver)
    }

    return goto.enterYourEmail()
  }

  if (action === a.enterYourEmail) {
    if (message === t.back) return goto.nameserverSelection(info.website_name)

    if (!isValidEmail(message)) {
      return send(chatId, hP.generatePlanStepText('invalidEmail'), bc)
    }
    return goto.confirmEmailBeforeProceeding(message)
  }

  if (action === a.confirmEmailBeforeProceeding) {
    if (message === t.back) return goto.enterYourEmail()
    if (message === t.yesProceedWithThisEmail(info.email)) return goto.proceedWithEmail(info.website_name, info.price)
  }

  if (action === a.proceedWithEmail) {
    if (message === t.back) return goto.enterYourEmail()
    if (message === t.proceedWithPayment)
      return goto.plansAskCoupon('choose-hosting-to-buy')
  }

  // 123456
  if (action === a.proceedWithPaymentProcess) {
    if (message === t.back) return goto['hosting-pay']()
    if (message === t.iHaveSentThePayment) return goto.iHaveSentThePayment()
  }

  // shortURL
  if (message === user.redSelectUrl) {
    return goto.redSelectUrl()
  }

  if (action === a.redSelectUrl) {
    if (message === t.back) return goto.submenu1()
    if (!isValidUrl(message)) return send(chatId, t.redValidUrl, bc)
    saveInfo('url', message)
    return goto.redSelectProvider()
  }

  if (action === a.redSelectProvider) {
    if (message === t.back) return goto.redSelectUrl()
    if (message === user.buyPlan) return goto['choose-subscription']()
    const redSelectProvider = trans('redSelectProvider')
    if (!redSelectProvider.includes(message)) return send(chatId, t.what)
    saveInfo('provider', message)
    // bitly
    if (message === redSelectProvider[0]) {
      await saveInfo('price', PRICE_BITLY_LINK)
      return goto.askCoupon(a.redSelectProvider)
    }
    // cuttly
    if (redSelectProvider[1] === message) {
      if (!((await freeLinksAvailable(chatId)) || (await isSubscribed(chatId))))
        return send(chatId, t.subscribeFirst, k.of([...redSelectProvider, user.buyPlan]))
      return goto.redSelectRandomCustom()
    }
  }
  if (action === a.redSelectRandomCustom) {
    if (message === t.back) return goto.redSelectProvider()

    const redSelectRandomCustom = trans('redSelectRandomCustom')

    if (!redSelectRandomCustom.includes(message)) return send(chatId, t.what)
    saveInfo('format', message)

    // random
    if (redSelectRandomCustom[0] === message) {

      try {
        const { url } = info
        let _shortUrl, shortUrl
        if (process.env.LINK_TO_SELF_SERVER === 'false') {
          _shortUrl = await createShortUrlApi(url)
          shortUrl = _shortUrl.replaceAll('.', '@').replace('https://', '')
          set(linksOf, chatId, shortUrl, url)
        } else {
          const slug = nanoid()
          const __shortUrl = `${SELF_URL}/${slug}`
          _shortUrl = await createShortUrlApi(__shortUrl)
          shortUrl = __shortUrl.replaceAll('.', '@').replace('https://', '')
          const shortUrlLink = _shortUrl.replaceAll('.', '@').replace('https://', '')
          set(linksOf, chatId, shortUrlLink, url)
        }
        increment(totalShortLinks)
        set(maskOf, shortUrl, _shortUrl)
        set(fullUrlOf, shortUrl, url)

        if (!(await isSubscribed(chatId))) {
          decrement(freeShortLinksOf, chatId)
          set(expiryOf, shortUrl, Date.now() + FREE_LINKS_TIME_SECONDS)
        }
        set(state, chatId, 'action', 'none')
        return send(chatId, _shortUrl, trans('o'))
      } catch (error) {
        send(TELEGRAM_ADMIN_CHAT_ID, error?.response?.data)
        set(state, chatId, 'action', 'none')
        return send(chatId, t.redIssueUrlCuttly, trans('o'))
      }
    }

    // custom
    if (redSelectRandomCustom[1] === message) return goto.redSelectCustomExt()
  }
  if (action === a.redSelectCustomExt) {
    if (message === t.back) return goto.redSelectRandomCustom()

    if (!isValidUrl(`https://abc.com/${message}`)) return send(chatId, t.notValidHalf)
    try {
      const { url } = info
      const slug = nanoid()
      const __shortUrl = `${SELF_URL}/${slug}`
      const _shortUrl = await createCustomShortUrlCuttly(__shortUrl, message)
      const shortUrl = __shortUrl.replaceAll('.', '@').replace('https://', '')
      increment(totalShortLinks)
      set(maskOf, shortUrl, _shortUrl)
      set(fullUrlOf, shortUrl, url)
      set(linksOf, chatId, shortUrl, url)
      if (!(await isSubscribed(chatId))) {
        decrement(freeShortLinksOf, chatId)
        set(expiryOf, shortUrl, Date.now() + FREE_LINKS_TIME_SECONDS)
      }
      set(state, chatId, 'action', 'none')
      return send(chatId, _shortUrl, trans('o'))
    } catch (error) {
      if (error?.response?.data?.url?.status === 3) {
        return send(chatId, t.redIssueSlugCuttly)
      }

      send(
        TELEGRAM_ADMIN_CHAT_ID,
        'cuttly issue: status:' + error?.response?.data?.url?.status + ' ' + error?.response?.data,
      )
      set(state, chatId, 'action', 'none')
      return send(chatId, t.redIssueUrlCuttly, trans('o'))
    }
  }

  if (action === a.askCoupon + a.redSelectProvider) {
    if (message === t.back) return goto.redSelectProvider()
    if (message === t.skip) {
      saveInfo('lastStep', a.redSelectProvider)
      return (await saveInfo('couponApplied', false)) || goto.walletSelectCurrency()
    }

    const { price } = info
    const coupon = message.toUpperCase()
    const discount = discountOn[coupon]

    if (isNaN(discount)) return send(chatId, t.couponInvalid)

    const newPrice = price - (price * discount) / 100
    send(chatId, t.redNewPrice(price, newPrice), k.pay)
    await saveInfo('newPrice', newPrice)
    await saveInfo('couponApplied', true)
    await saveInfo('lastStep', a.redSelectProvider)

    return goto.walletSelectCurrency()
  }

  if (message === user.urlShortener) {
    if (!(await isSubscribed(chatId))) return send(chatId, '📋 Subscribe first')

    return goto['choose-url-to-shorten']()
  }
  if (action === 'choose-url-to-shorten') {
    if (message === t.back) return goto.submenu1()
    if (!isValidUrl(message)) return send(chatId, t.provideLink, bc)

    set(state, chatId, 'url', message)

    const domains = await getPurchasedDomains(chatId)
    return goto['choose-domain-with-shorten']([...domains, ...adminDomains])
  }
  if (action === 'choose-domain-with-shorten') {
    if (message === t.back) return goto['choose-url-to-shorten']()
    if (message === user.buyDomainName) return goto['choose-domain-to-buy']()

    const domain = message.toLowerCase()
    const domains = await getPurchasedDomains(chatId)
    if (!(domains.includes(domain) || adminDomains.includes(domain))) {
      return send(chatId, 'Please choose a valid domain')
    }
    set(state, chatId, 'selectedDomain', message)
    return goto['choose-link-type']()
  }
  if (action === 'choose-link-type') {
    if (message === t.back) return goto['choose-domain-with-shorten'](await getPurchasedDomains(chatId))
    const linkOptions = trans('linkOption')
    if (!linkOptions.includes(message)) return send(chatId, t.what)

    if (message === t.customLink) {
      set(state, chatId, 'action', 'shorten-custom')
      return send(chatId, t.askShortLinkExtension, bc)
    }

    // Random Link
    const url = info?.url
    const domain = info?.selectedDomain
    const shortUrl = domain + '/' + nanoid()
    if (await get(fullUrlOf, shortUrl)) {
      send(chatId, t.linkAlreadyExist)
      return
    }

    const shortUrlSanitized = shortUrl.replaceAll('.', '@')
    increment(totalShortLinks)
    set(state, chatId, 'action', 'none')
    set(fullUrlOf, shortUrlSanitized, url)
    set(linksOf, chatId, shortUrlSanitized, url)
    send(chatId, t.yourShortendUrl(shortUrl), trans('o'))
    if (adminDomains.includes(domain)) {
      decrement(freeShortLinksOf, chatId)
      set(expiryOf, shortUrlSanitized, Date.now() + FREE_LINKS_TIME_SECONDS)
    }
    return
  }
  if (action === 'shorten-custom') {
    if (message === t.back) return goto['choose-link-type']()

    const url = info?.url
    const domain = info?.selectedDomain
    const shortUrl = domain + '/' + message

    if (!isValidUrl('https://' + shortUrl)) return send(chatId, t.provideLink)
    if (await get(fullUrlOf, shortUrl)) return send(chatId, t.linkAlreadyExist)

    const shortUrlSanitized = shortUrl.replaceAll('.', '@')
    increment(totalShortLinks)
    set(state, chatId, 'action', 'none')
    set(fullUrlOf, shortUrlSanitized, url)
    set(linksOf, chatId, shortUrlSanitized, url)
    send(chatId, `Your shortened URL is: ${shortUrl}`, trans('o'))
    if (adminDomains.includes(domain)) {
      decrement(freeShortLinksOf, chatId)
      set(expiryOf, shortUrlSanitized, Date.now() + FREE_LINKS_TIME_SECONDS)
    }
    return
  }
  //
  //
  if (message === user.buyDomainName) {
    return goto['choose-domain-to-buy']()
  }
  if (action === 'choose-domain-to-buy') {
    if (message === t.back) return goto.submenu2()
    let domain = message.toLowerCase()
    domain = domain.replace('https://', '')
    domain = domain.replace('http://', '')

    const domainRegex = /^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/
    if (!domainRegex.test(domain))
      return send(chatId, t.domainInvalid)
    const { available, price, originalPrice, message: msg } = await checkDomainPriceOnline(domain)
    if (!available) return send(chatId, msg)
    if (!originalPrice) {
      send(TELEGRAM_DEV_CHAT_ID, t.issueGettingPrice)
      return send(chatId, t.issueGettingPrice)
    }
    saveInfo('price', price)
    saveInfo('domain', domain)
    saveInfo('originalPrice', originalPrice)
    return goto.askDomainToUseWithShortener()
  }
  if (action === a.askDomainToUseWithShortener) {
    const yesNo = trans('yesNo')
    if (message === t.back) return goto['choose-domain-to-buy']()
    if (!yesNo.includes(message)) return send(chatId, t.what)
    saveInfo('askDomainToUseWithShortener', message)

    if (info?.originalPrice <= 2 && (await isSubscribed(chatId))) {
      const available = (await get(freeDomainNamesAvailableFor, chatId)) || 0
      if (available > 0) return goto['get-free-domain']()
    }

    return goto.askCoupon('choose-domain-to-buy')
  }
  if (action === a.askCoupon + 'choose-domain-to-buy') {
    if (message === t.back) return goto.askDomainToUseWithShortener()
    if (message === t.skip) return goto.skipCoupon('domain-pay')

    const { price } = info

    const coupon = message.toUpperCase()
    const discount = discountOn[coupon]
    if (isNaN(discount)) return send(chatId, t.couponInvalid)

    const newPrice = price - (price * discount) / 100
    await saveInfo('newPrice', newPrice)
    await saveInfo('couponApplied', true)

    return goto['domain-pay']()
  }

  // Coupon for domain
  if (action === a.askCoupon + 'choose-hosting-to-buy') {
    if (message === t.back) return goto.proceedWithEmail(info.website_name, info.price)
    if (message === t.skip) return goto.skipCoupon('hosting-pay')

    const { totalPrice } = info

    const coupon = message.toUpperCase()
    const discount = discountOn[coupon]

    if (isNaN(discount)) return send(chatId, t.couponInvalid)

    const couponDiscount = (totalPrice * discount) / 100;
    const newPrice = totalPrice - couponDiscount;

    await saveInfo('couponApplied', true)
    await saveInfo('couponDiscount', couponDiscount)
    await saveInfo('newPrice', newPrice)

    return goto['hosting-pay']()
  }
  if (action === 'domain-pay') {
    if (message === t.back) return goto.askCoupon('choose-domain-to-buy')
    const payOption = message

    if (payOption === payIn.crypto) {
      set(state, chatId, 'action', 'crypto-pay-domain')
      return send(chatId, t.selectCryptoToDeposit, trans('k.of', trans('supportedCryptoViewOf')))
    }

    if (payOption === payIn.bank) {
      set(state, chatId, 'action', 'bank-pay-domain')
      return send(chatId, t.askEmail, bc)
    }

    if (payOption === payIn.wallet) {
      set(state, chatId, 'lastStep', 'domain-pay')
      return goto.walletSelectCurrency()
    }

    return send(chatId, t.askValidPayOption)
  }
  if (action === 'bank-pay-domain') {
    if (message === t.back) return goto['domain-pay']()
    const email = message
    const price = info?.price
    const domain = info?.domain
    if (!isValidEmail(email)) return send(chatId, t.askValidEmail)

    const ref = nanoid()

    log({ ref })
    set(state, chatId, 'action', 'none')
    const priceNGN = Number(await usdToNgn(price))
    set(chatIdOfPayment, ref, { chatId, price, domain, endpoint: `/bank-pay-domain` })
    const { url, error } = await createCheckout(priceNGN, `/ok?a=b&ref=${ref}&`, email, username, ref)
    if (error) return send(chatId, error, trans('o'))
    send(chatId, `Bank ₦aira + Card 🌐︎`, trans('o'))
    console.log('showDepositNgnInfo', url)
    return send(chatId, t.bankPayDomain(priceNGN, domain), payBank(url))
  }
  if (action === 'crypto-pay-domain') {
    if (message === t.back) return goto['domain-pay']()
      const tickerView = message
      const supportedCryptoView = trans('supportedCryptoView')
      const ticker = supportedCryptoView[tickerView]
      if (!ticker) return send(chatId, t.askValidCrypto)
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const domain = info?.domain
      const ref = nanoid()
      if (BLOCKBEE_CRYTPO_PAYMENT_ON === 'true') {
        const coin = tickerOf[ticker]
        set(chatIdOfPayment, ref, { chatId, price, domain })
        const { address, bb } = await getCryptoDepositAddress(coin, chatId, SELF_URL, `/crypto-pay-domain?a=b&ref=${ref}&`)
        saveInfo('ref', ref)
        log({ ref })
        await sendQrCode(bot, chatId, bb, info?.userLanguage ?? 'en')
        set(state, chatId, 'action', 'none')
        const priceCrypto = await convert(price, 'usd', coin)
        return send(chatId, t.showDepositCryptoInfoDomain(priceCrypto, ticker, address, domain), trans('o'))
      } else {
        const coin = tickerOfDyno[ticker]
        const redirect_url = `${SELF_URL}/dynopay/crypto-pay-domain`
        const meta_data = {
          "product_name": dynopayActions.payDomain,
          "refId" : ref
        }
        const { qr_code, address } = await getDynopayCryptoAddress(price, coin, redirect_url, meta_data)
        set(chatIdOfDynopayPayment, ref, { chatId, price, domain, action: dynopayActions.payDomain, address })
        saveInfo('ref', ref)
        log({ ref })
        await generateQr(bot, chatId, qr_code, info?.userLanguage ?? 'en')
        set(state, chatId, 'action', 'none')
        const priceCrypto = await convert(price, 'usd',  tickerOf[ticker])
        return send(chatId, t.showDepositCryptoInfoDomain(priceCrypto, ticker, address, domain), trans('o'))
      }
  }

  // Hosting payment
  if (action === 'hosting-pay') {
    if (message === t.back) return goto.plansAskCoupon('choose-hosting-to-buy')
    const payOption = message

    if (payOption === payIn.crypto) {
      set(state, chatId, 'action', 'crypto-pay-hosting')
      return send(chatId, t.selectCryptoToDeposit, trans('k.of', trans('supportedCryptoViewOf')))
    }

    if (payOption === payIn.bank) {
      set(state, chatId, 'action', 'bank-pay-hosting')
      return send(chatId, t.askEmail, bc)
    }

    if (payOption === payIn.wallet) {
      set(state, chatId, 'lastStep', 'hosting-pay')
      return goto.walletSelectCurrency(true)
    }

    return send(chatId, t.askValidPayOption)
  }
  if (action === 'bank-pay-hosting') {
    if (message === t.back) return goto['hosting-pay']()
    const email = message
    const price = info?.totalPrice
    const domain = info?.domain
    if (!isValidEmail(email)) return send(chatId, t.askValidEmail)

    const ref = nanoid()

    log({ ref })
    set(state, chatId, 'action', a.proceedWithPaymentProcess)
    const priceNGN = Number(await usdToNgn(price))
    set(chatIdOfPayment, ref, { chatId, price, domain, endpoint: `/bank-pay-hosting` })
    const { url, error } = await createCheckout(priceNGN, `/ok?a=b&ref=${ref}&`, email, username, ref)
    if (error) return send(chatId, error, trans('o'))
    send(chatId, `Bank ₦aira + Card 🌐︎`, trans('o'))
    console.log('showDepositNgnInfo', url)
    return send(chatId, hP.bankPayDomain(priceNGN, info.plan), payBank(url), k.of([t.iHaveSentThePayment]))
  }
  if (action === 'crypto-pay-hosting') {
    if (message === t.back) return goto['hosting-pay']()
    const tickerView = message
    const supportedCryptoView = trans('supportedCryptoView')
    const ticker = supportedCryptoView[tickerView]
    if (!ticker) return send(chatId, t.askValidCrypto)
    const price = info?.couponApplied ? info?.newPrice : info?.totalPrice
    const domain = info?.domain
    const plan = info?.plan
    const ref = nanoid()
    if (BLOCKBEE_CRYTPO_PAYMENT_ON === 'true') {
      const coin = tickerOf[ticker]
      set(chatIdOfPayment, ref, { chatId, price, domain })
      const { address, bb } = await getCryptoDepositAddress(coin, chatId, SELF_URL, `/crypto-pay-hosting?a=b&ref=${ref}&`)
      log({ ref })
      await sendQrCode(bot, chatId, bb, info?.userLanguage ?? 'en')
      set(state, chatId, 'action', a.proceedWithPaymentProcess)
      const priceCrypto = await convert(price, 'usd', coin)
      return send(chatId, hP.showCryptoPaymentInfo(priceCrypto, ticker, address, plan), k.of([t.iHaveSentThePayment]))
    } else {
      const coin = tickerOfDyno[ticker]
      if (!coin) return send(chatId, t.askValidCrypto)
      const redirect_url = `${SELF_URL}/dynopay/crypto-pay-hosting`
      const meta_data = {
        "product_name": dynopayActions.payHosting,
        "refId" : ref
      }
      const { qr_code, address } = await getDynopayCryptoAddress(price, coin, redirect_url, meta_data)
      set(chatIdOfDynopayPayment, ref, { chatId, price, domain, action: dynopayActions.payHosting, address })
      log({ ref })
      await generateQr(bot, chatId, qr_code, info?.userLanguage ?? 'en')
      set(state, chatId, 'action', a.proceedWithPaymentProcess)
      const priceCrypto = await convert(price, 'usd', tickerOf[ticker])
      return send(chatId, hP.showCryptoPaymentInfo(priceCrypto, ticker, address, plan), k.of([t.iHaveSentThePayment]))
    }
  }
  if (action === 'get-free-domain') {
    if (message === t.back || message === t.no) return goto['choose-domain-to-buy']()
    if (message !== t.yes) return send(chatId, t.what)

    const domain = info?.domain
    const lang = info?.userLanguage ?? 'en'
    const error = await buyDomainFullProcess(chatId, lang, domain)
    if (!error) decrement(freeDomainNamesAvailableFor, chatId)

    return set(state, chatId, 'action', 'none')
  }
  //
  //
  if (message === user.buyPlan) {
    if (await isSubscribed(chatId)) {
      const time = await get(planEndingTime, chatId)
      const endDate = new Date(time)
      const currentDate = new Date()
      const daysRemaining = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24)) // Calculate number of days remaining
      return send(chatId, t.alreadySubscribedPlan(daysRemaining === 1 ? '1 day.' : `${daysRemaining} days.`))
    }
    return goto['choose-subscription']()
  }
  if (action === 'choose-subscription') {
    const planOptionsOf = trans('planOptionsOf')
    const planOptions = trans('planOptions')
    if (!planOptions.includes(message)) return send(chatId, t.chooseValidPlan, trans('chooseSubscription'))
    const plan = planOptionsOf[message]
    await saveInfo('plan', plan)
    await saveInfo('price', priceOf[plan])
    return goto.askCoupon('choose-subscription')
  }
  if (action === a.askCoupon + 'choose-subscription') {
    if (message === t.back) return goto['choose-subscription']()
    const price = priceOf[info?.plan]
    saveInfo('price', price)
    if (message === t.skip) return (await saveInfo('couponApplied', false)) || goto['plan-pay']()

    const coupon = message.toUpperCase()
    const discount = discountOn[coupon]
    if (isNaN(discount)) return send(chatId, t.couponInvalid)

    const newPrice = price - (price * discount) / 100
    await saveInfo('newPrice', newPrice)
    await saveInfo('couponApplied', true)

    return goto['plan-pay']()
  }
  if (action === 'plan-pay') {
    if (message === t.back) return goto.askCoupon('choose-subscription')
    const payOption = message
    if (payOption === payIn.crypto) {
      set(state, chatId, 'action', 'crypto-pay-plan')
      return send(chatId, t.selectCryptoToDeposit, trans('k.of', trans('supportedCryptoViewOf')))
    }
    if (payOption === payIn.bank) {
      set(state, chatId, 'action', 'bank-pay-plan')
      return send(chatId, t.askEmail, bc)
    }
    if (payOption === payIn.wallet) {
      set(state, chatId, 'lastStep', 'plan-pay')
      return goto.walletSelectCurrency()
    }
    return send(chatId, t.askValidPayOption)
  }
  if (action === 'bank-pay-plan') {
    if (message === t.back) return goto['plan-pay']()

    const email = message
    if (!isValidEmail(email)) return send(chatId, t.askValidEmail)

    const { plan } = info
    const price = info?.couponApplied ? info?.newPrice : info?.price
    const priceNGN = Number(await usdToNgn(price))

    const ref = nanoid()
    set(state, chatId, 'action', 'none')
    set(chatIdOfPayment, ref, { chatId, price, plan, endpoint: `/bank-pay-plan` })
    const { url, error } = await createCheckout(priceNGN, `/ok?a=b&ref=${ref}&`, email, username, ref)

    log({ ref })
    if (error) return send(chatId, error, trans('o'))
    send(chatId, `Bank ₦aira + Card 🌐︎`, trans('o'))
    console.log('showDepositNgnInfo', url)
    return send(chatId, t['bank-pay-plan'](priceNGN, plan), payBank(url))
  }
  if (action === 'crypto-pay-plan') {
    if (message === t.back) return goto['plan-pay']()

    const ref = nanoid()
    const tickerView = message
    const supportedCryptoView = trans('supportedCryptoView')
    const ticker = supportedCryptoView[tickerView]
    if (!ticker) return send(chatId, t.askValidCrypto)
    const { plan } = info
    const price = info?.couponApplied ? info?.newPrice : info?.price 
    if (BLOCKBEE_CRYTPO_PAYMENT_ON === 'true') {
      const coin = tickerOf[ticker]
      const { address, bb } = await getCryptoDepositAddress(coin, chatId, SELF_URL, `/crypto-pay-plan?a=b&ref=${ref}&`)
      set(chatIdOfPayment, ref, { chatId, price, plan })
      log({ ref })
      await sendQrCode(bot, chatId, bb, info?.userLanguage ?? 'en')
      set(state, chatId, 'action', 'none')
      const priceCrypto = await convert(price, 'usd', coin)
      return send(chatId, t.showDepositCryptoInfoPlan(priceCrypto, ticker, address, plan), trans('o'))
    } else {
      const coin = tickerOfDyno[ticker]
      if (!coin) return send(chatId, t.askValidCrypto)
      const redirect_url = `${SELF_URL}/dynopay/crypto-pay-plan`
      const meta_data = {
        "product_name": dynopayActions.payPlan,
        "refId" : ref
      }
      const { qr_code, address } = await getDynopayCryptoAddress(price, coin, redirect_url, meta_data)
      set(chatIdOfDynopayPayment, ref, { chatId, price, plan, action: dynopayActions.payPlan, address })
      log({ ref })
      await generateQr(bot, chatId, qr_code, info?.userLanguage ?? 'en')
      const priceCrypto = await convert(price, 'usd', tickerOf[ticker])
      return send(chatId, t.showDepositCryptoInfoPlan(priceCrypto, ticker, address, plan), trans('o'))
    }
  }
  //
  //
  if (message === user.dnsManagement) {
    if (!(await ownsDomainName(chatId))) {
      send(chatId, t.noDomainFound)
      return
    }

    return goto['choose-domain-to-manage']()
  }
  if (action === 'choose-domain-to-manage') {
    if (message === t.back) return goto.submenu2()
    const domain = message.toLowerCase()

    const domains = await getPurchasedDomains(chatId)
    if (!domains.includes(domain)) {
      return send(chatId, t.chooseValidDomain)
    }

    await set(state, chatId, 'domainToManage', domain)
    info = await get(state, chatId)

    return goto['choose-dns-action']()
  }
  if (action === 'choose-dns-action') {
    if (message === t.back) return goto['choose-domain-to-manage']()

    if (![t.addDns, t.updateDns, t.deleteDns].includes(message)) return send(chatId, t.selectValidOption)

    if (message === t.deleteDns) return goto['select-dns-record-id-to-delete']()

    if (message === t.updateDns) return goto['select-dns-record-id-to-update']()

    if (message === t.addDns) return goto['select-dns-record-type-to-add']()
  }
  //
  if (action === 'select-dns-record-id-to-delete') {
    if (message === t.back) return goto['choose-dns-action']()

    let id = Number(message)
    if (isNaN(id) || !(id > 0 && id <= info?.dnsRecords.length)) return send(chatId, t.selectValidOption)

    set(state, chatId, 'delId', --id) // User See id as 1,2,3 and we see as 0,1,2
    return goto['confirm-dns-record-id-to-delete']()
  }
  if (action === 'confirm-dns-record-id-to-delete') {
    if (message === t.back || message === t.no) return goto['select-dns-record-id-to-delete']()
    if (message !== t.yes) return send(chatId, t.what)

    const { domainNameId, dnsRecords, domainToManage, delId } = info
    const nsRecords = dnsRecords.filter(r => r.recordType === 'NS')
    const { dnszoneID, dnszoneRecordID, nsId } = dnsRecords[delId]
    const { error } = await deleteDNSRecord(dnszoneID, dnszoneRecordID, domainToManage, domainNameId, nsId, nsRecords)
    if (error) return send(chatId, t.errorDeletingDns(error))

    send(chatId, t.dnsRecordDeleted)
    return goto['choose-dns-action']()
  }
  if (action === 'select-dns-record-type-to-add') {
    if (message === t.back) return goto['choose-dns-action']()

    const recordType = message

    if (![t.cname, t.ns, t.a].includes(recordType)) {
      return send(chatId, t.selectValidOption)
    }

    return goto['type-dns-record-data-to-add'](recordType)
  }
  if (action === 'type-dns-record-data-to-add') {
    if (message === t.back) return goto['select-dns-record-type-to-add']()

    const domain = info?.domainToManage
    const recordType = info?.recordType
    const recordContent = message
    const dnsRecords = info?.dnsRecords
    const nsRecords = dnsRecords?.filter(r => r.recordType === 'NS')
    const domainNameId = info?.domainNameId

    if (nsRecords.length >= 4 && t[recordType] === 'NS') {
      send(chatId, t.maxDnsRecord)
      return goto['choose-dns-action']()
    }

    const nextId = nextNumber(nsRecords.map(r => r.nsId))
    const { error } = await saveServerInDomain(domain, recordContent, t[recordType], domainNameId, nextId, nsRecords)
    if (error) {
      const m = errorSavingDns
      return send(chatId, m)
    }

    send(chatId, t.dnsRecordSaved)
    return goto['choose-dns-action']()
  }
  //
  if (action === 'select-dns-record-id-to-update') {
    if (message === t.back) return goto['choose-dns-action']()

    const dnsRecords = info?.dnsRecords
    let id = Number(message)
    if (isNaN(id) || !(id > 0 && id <= dnsRecords.length)) {
      return send(chatId, t.selectValidOption)
    }
    id-- // User See id as 1,2,3 and we see as 0,1,2

    return goto['type-dns-record-data-to-update'](id, dnsRecords[id]?.recordType)
  }
  if (action === 'type-dns-record-data-to-update') {
    if (message === t.back) return goto['select-dns-record-id-to-update']()

    const recordContent = message
    const dnsRecords = info?.dnsRecords
    const domainNameId = info?.domainNameId
    const domain = info?.domainToManage
    const id = info?.dnsRecordIdToUpdate

    const { dnszoneID, dnszoneRecordID, recordType, nsId } = dnsRecords[id]

    const { error } = await updateDNSRecord(
      dnszoneID,
      dnszoneRecordID,
      domain,
      recordType,
      recordContent,
      domainNameId,
      nsId,
      dnsRecords.filter(r => r.recordType === 'NS'),
    )
    if (error) {
      const m = `Error update dns record, ${error}, Provide value again`
      send(chatId, m)
      return m
    }

    send(chatId, t.dnsRecordUpdated)
    return goto['choose-dns-action']()
  }
  //
  //
  //
  if (message === user.wallet) {
    return goto[user.wallet]()
  }
  if (action === user.wallet) {
    if (message === u.deposit) return goto[a.selectCurrencyToDeposit]() // can be combine in one line with object
    if (message === u.withdraw) return goto[a.selectCurrencyToWithdraw]()
    return send(chatId, t.what)
  }

  if (message === u.deposit) return goto[a.selectCurrencyToDeposit]()

  if (action === a.selectCurrencyToDeposit) {
    if (message === t.back) return goto[user.wallet]()
    if (message === u.usd) return goto[a.depositUSD]()
    if (message === u.ngn) return goto[a.depositNGN]()
    return send(chatId, t.what)
  }

  if (action === a.depositNGN) {
    if (message === t.back) return goto[a.selectCurrencyToDeposit]()

    const amount = message
    if (isNaN(amount)) return send(chatId, t.askValidAmount)
    await saveInfo('depositAmountNgn', Number(amount))
    return goto[a.askEmailForNGN]()
  }
  if (action === a.askEmailForNGN) {
    if (message === t.back) return goto[a.depositNGN]()

    const email = message
    if (!isValidEmail(email)) return send(chatId, t.askValidEmail)
    await saveInfo('email', email)
    return goto.showDepositNgnInfo()
  }

  if (action === a.depositUSD) {
    if (message === t.back) return goto[a.selectCurrencyToDeposit]()

    const amount = Number(message)
    if (isNaN(amount)) return send(chatId, t.whatNum)
    await saveInfo('amount', amount)

    return goto[a.selectCryptoToDeposit]()
  }
  if (action === a.selectCryptoToDeposit) {
    if (message === t.back) return goto[a.depositUSD]()

    const tickerView = message
    const supportedCryptoView = trans('supportedCryptoView')
    const ticker = supportedCryptoView[tickerView]
    if (!ticker) return send(chatId, t.askValidCrypto)
    await saveInfo('tickerView', ticker)
    return goto.showDepositCryptoInfo()
  }
  //
  //
  if (action === a.walletSelectCurrency) {
    if (message === t.back) return goto[info?.lastStep]()

    const coin = message
    if (![u.usd, u.ngn].includes(coin)) return send(chatId, t.what)
    await saveInfo('coin', coin)

    return goto.walletSelectCurrencyConfirm()
  }
  if (action === a.walletSelectCurrencyConfirm) {
    if (message === t.back || message === t.no) return goto[a.walletSelectCurrency]()

    if (message !== t.yes) return send(chatId, t.what)

    try {
      return walletOk[info?.lastStep](info?.coin)
    } catch (error) {
      return sendMessage(chatId, 'Error code 209 ' + error?.message)
    }
  }

  //
  //
  if (message === user.urlShortenerMain) {
    return goto.submenu1()
  }
  if (message === user.domainNames) {
    return goto.submenu2()
  }
  if (message === user.phoneNumberLeads) {
    return goto.phoneNumberLeads()
  }
  if (action === a.phoneNumberLeads) {
    if (phoneNumberLeads[1] === message) return goto.validatorSelectCountry()
    if (phoneNumberLeads[0] === message) return goto.buyLeadsSelectCountry()

    return send(chatId, t.what)
  }
  if (action === a.buyLeadsSelectCountry) {
    if (message === t.back) goto.phoneNumberLeads()
    if (!buyLeadsSelectCountry.includes(message)) return send(chatId, t.what)
    if (areasOfCountry[message] && Object.keys(areasOfCountry[message]).length === 0) return send(chatId, `Coming Soon`)
    saveInfo('country', message)
    return goto.buyLeadsSelectSmsVoice()
  }
  if (action === a.buyLeadsSelectSmsVoice) {
    if (message === t.back) return goto.buyLeadsSelectCountry()
    if (buyLeadsSelectSmsVoice[1] === message) return send(chatId, `Coming Soon`)
    if (!buyLeadsSelectSmsVoice.includes(message)) return send(chatId, t.what)
    saveInfo('smsVoice', message)
    saveInfo('cameFrom', a.buyLeadsSelectSmsVoice)
    if (['Australia'].includes(info?.country)) return goto.buyLeadsSelectCarrier()
    if (['USA', 'Canada'].includes(info?.country)) return goto.buyLeadsSelectArea()
    return goto.buyLeadsSelectAreaCode()
  }
  if (action === a.buyLeadsSelectArea) {
    if (message === t.back) return goto.buyLeadsSelectSmsVoice()
    if (!buyLeadsSelectArea(info?.country).includes(message)) return send(chatId, t.what)
    await saveInfo('area', message)
    saveInfo('cameFrom', a.buyLeadsSelectArea)
    return goto.buyLeadsSelectAreaCode()
  }
  if (action === a.buyLeadsSelectAreaCode) {
    if (message === t.back) return goto?.[info?.cameFrom]()
    const areaCodes = buyLeadsSelectAreaCode(
      info?.country,
      ['USA', 'Canada'].includes(info?.country) ? info?.area : 'Area Codes',
    )
    if (!areaCodes.includes(message)) return send(chatId, t.what)

    let cc = countryCodeOf[info?.country]
    saveInfo('areaCode', message === 'Mixed Area Codes' ? message : parse(cc, message))

    return goto.buyLeadsSelectCarrier()
  }
  if (action === a.buyLeadsSelectCarrier) {
    if (message === t.back) return goto?.[info?.cameFrom]()
    if (!buyLeadsSelectCarrier(info?.country).includes(message)) return send(chatId, t.what)
    saveInfo('carrier', message)
    saveInfo('cameFrom', a.buyLeadsSelectCarrier)
    if (['USA'].includes(info?.country)) return goto.buyLeadsSelectCnam()
    return goto.buyLeadsSelectAmount()
  }
  if (action === a.buyLeadsSelectCnam) {
    if (message === t.back) return goto.buyLeadsSelectCarrier()
    if (!buyLeadsSelectCnam.includes(message)) return send(chatId, t.what)
    saveInfo('cnam', message === t.yes)
    saveInfo('cameFrom', a.buyLeadsSelectCnam)
    return goto.buyLeadsSelectAmount()
  }
  if (action === a.buyLeadsSelectAmount) {
    if (message === t.back) return goto?.[info?.cameFrom]()

    const amount = Number(message)
    if (chatId === 6687923716) {
      if (isNaN(amount)) return send(chatId, t.whatNum)
    } else if (
      isNaN(amount) ||
      amount < Number(buyLeadsSelectAmount[0]) ||
      amount > Number(buyLeadsSelectAmount[buyLeadsSelectAmount.length - 1])
    )
      return send(chatId, t.whatNum)

    saveInfo('amount', amount)
    let cnam = info?.country === 'USA' ? info?.cnam : false
    const price = amount * RATE_LEAD + (cnam ? amount * RATE_CNAM : 0)
    saveInfo('price', price)
    return goto.buyLeadsSelectFormat()
  }
  if (action === a.buyLeadsSelectFormat) {
    if (message === t.back) return goto.buyLeadsSelectAmount()
    if (!buyLeadsSelectFormat.includes(message)) return send(chatId, t.what)
    saveInfo('format', message)
    return goto.askCoupon(a.buyLeadsSelectFormat)
  }
  if (action === a.askCoupon + a.buyLeadsSelectFormat) {
    if (message === t.back) return goto.buyLeadsSelectFormat()
    if (message === t.skip) {
      saveInfo('lastStep', a.buyLeadsSelectFormat)
      return (await saveInfo('couponApplied', false)) || goto.walletSelectCurrency()
    }

    const { price } = info

    const coupon = message.toUpperCase()
    const discount = discountOn[coupon]

    if (isNaN(discount)) return send(chatId, t.couponInvalid)

    const newPrice = price - (price * discount) / 100
    await saveInfo('newPrice', newPrice)
    await saveInfo('couponApplied', true)

    await saveInfo('lastStep', a.buyLeadsSelectFormat)

    return goto.walletSelectCurrency()
  }

  //phone number validator
  if (action === a.validatorSelectCountry) {
    if (message === t.back) return goto.phoneNumberLeads()
    if (!validatorSelectCountry.includes(message)) return send(chatId, t.what)
    saveInfo('country', message)
    return goto.validatorPhoneNumber()
  }

  // get phone on file
  if (action === a.validatorPhoneNumber) {
    if (message === t.back) return goto.validatorSelectCountry()
    let content

    if (msg.document) {
      try {
        const fileLink = await bot?.getFileLink(msg.document.file_id)
        content = (await axios.get(fileLink, { responseType: 'text' }))?.data
      } catch (error) {
        console.error('Error:', error.message)
        return send(chatId, t.fileError)
      }
    } else {
      content = message
    }

    let cc = countryCodeOf[info?.country]
    const { phones, diff } = extractPhoneNumbers(content, cc)
    if (phones < diff) return send(chatId, t.validatorErrorFileData) // good phones are less than bad ones
    if (phones.length === 0) return send(chatId, t.validatorErrorNoPhonesFound)
    await saveInfo('phones', phones)
    saveInfo('amount', phones.length)

    return goto.validatorSelectSmsVoice()
  }

  if (action === a.validatorSelectSmsVoice) {
    if (message === t.back) return goto.validatorPhoneNumber()
    if (validatorSelectSmsVoice[1] === message) return send(chatId, `Coming Soon`)
    if (!validatorSelectSmsVoice.includes(message)) return send(chatId, t.what)
    saveInfo('smsVoice', message)
    return goto.validatorSelectCarrier() //////
  }

  if (action === a.validatorSelectCarrier) {
    if (message === t.back) return goto.validatorSelectSmsVoice()
    if (!validatorSelectCarrier(info?.country).includes(message)) return send(chatId, t.what)
    saveInfo('carrier', message)
    saveInfo('history', [...(info?.history || []), a.validatorSelectCarrier])
    if (!['USA'].includes(info?.country) && info?.phones.length < 2000) {
      return goto.validatorSelectFormat()
    }
    if (!['USA'].includes(info?.country)) return goto.validatorSelectAmount()
    return goto.validatorSelectCnam()
  }
  if (action === a.validatorSelectCnam) {
    if (message === t.back) return goBack()
    const validatorSelectCnam = trans('validatorSelectCnam')
    if (!validatorSelectCnam.includes(message)) return send(chatId, t.what)
    saveInfo('cnam', message === t.yes)
    saveInfo('history', [...(info?.history || []), a.validatorSelectCnam])

    if (info?.phones.length < 2000) {
      let cnam = info?.country === 'USA' ? info?.cnam : false
      const price = info?.amount * RATE_LEAD_VALIDATOR + (cnam ? info?.amount * RATE_CNAM_VALIDATOR : 0)
      saveInfo('price', price)

      return goto.validatorSelectFormat()
    }

    return goto.validatorSelectAmount()
  }

  if (action === a.validatorSelectAmount) {
    if (message === t.back) return goBack()
    let amount = message
    if (message.toLowerCase() === 'all') {
      amount = info?.phones.length
    }
    if (isNaN(amount)) return send(chatId, t.ammountIncorrect)
    saveInfo('amount', Number(amount))
    saveInfo('history', [...(info?.history || []), a.validatorSelectAmount])
    let cnam = info?.country === 'USA' ? info?.cnam : false
    const price = amount * RATE_LEAD_VALIDATOR + (cnam ? amount * RATE_CNAM_VALIDATOR : 0)
    saveInfo('price', price)
    return goto.validatorSelectFormat()
  }
  if (action === a.validatorSelectFormat) {
    if (message === t.back) return goBack()
    if (!validatorSelectFormat.includes(message)) return send(chatId, t.what)
    saveInfo('format', message)
    return goto.askCoupon(a.validatorSelectFormat)
  }
  if (action === a.askCoupon + a.validatorSelectFormat) {
    if (message === t.back) return goto.validatorSelectFormat()
    if (message === t.skip) {
      saveInfo('lastStep', a.validatorSelectFormat)
      return (await saveInfo('couponApplied', false)) || goto.walletSelectCurrency()
    }

    const { price } = info

    const coupon = message.toUpperCase()
    const discount = discountOn[coupon]
    if (isNaN(discount)) return send(chatId, t.couponInvalid)

    const newPrice = price - (price * discount) / 100
    await saveInfo('newPrice', newPrice)
    await saveInfo('couponApplied', true)

    await saveInfo('lastStep', a.validatorSelectFormat)

    return goto.walletSelectCurrency()
  }

  if (message === user.joinChannel) {
    return send(chatId, t.joinChannel)
  }

  if (message === user.viewPlan) {
    const subscribedPlan = await get(planOf, chatId)
    if (subscribedPlan) {
      const timeEnd = new Date(await get(planEndingTime, chatId))
      if (!(await isSubscribed(chatId))) {
        send(chatId, t.subscriptionExpire(subscribedPlan, timeEnd))
        return
      }

      send(
        chatId,
        t.plansSubscripedtill(subscribedPlan, timeEnd),
      )
      return
    }

    send(chatId, t.planNotSubscriped)
    return
  }
  if (message === user.becomeReseller) {
    return send(chatId, t.becomeReseller)
  }
  if (message === user.viewShortLinks) {
    const links = await getShortLinks(chatId)
    if (links.length === 0) {
      send(chatId, t.noShortenedUrlLink)
      return
    }

    const linksText = formatLinks(links.slice(-20)).join('\n\n')
    send(chatId, t.shortenedLinkText(linksText))
    return
  }
  if (message === user.viewDomainNames) {
    const purchasedDomains = await getPurchasedDomains(chatId)
    if (purchasedDomains.length === 0) {
      send(chatId, 'You have no purchased domains yet.')
      return
    }

    const domainsText = purchasedDomains.join('\n')
    send(chatId, `Here are your purchased domains:\n${domainsText}`)
    return
  }
  if (message === 'Backup Data') {
    if (!isDeveloper(chatId)) return send(chatId, 'not authorized')

    backupTheData()
    return send(chatId, 'Backup created successfully.')
  }
  if (message === 'Restore Data') {
    if (!isDeveloper(chatId)) return send(chatId, 'not authorized')

    restoreData()
    return send(chatId, 'Data restored successfully.')
  }
  if (message === admin.viewUsers) {
    if (!isAdmin(chatId)) return send(chatId, 'not authorized')

    const users = await getUsers()
    return send(chatId, `Users: ${users.length}\n${users.join('\n')}`)
  }
  if (message === admin.viewAnalytics) {
    if (!isAdmin(chatId)) return send(chatId, 'not authorized')

    const analyticsData = await getAnalytics()
    send(chatId, `Analytics Data:\n${analyticsData.join('\n')}`)
    return
  }
  if (message === user.getSupport) {
    send(chatId, t.support)
    return
  }
  if (message === user.freeTrialAvailable) {
    sendQr(
      bot,
      chatId,
      `${chatId}`,
      t.scanQrOrUseChat(chatId),
    )
    return send(chatId, t.freeTrialAvailable)
  }
  if (action === 'listen_reset_login') {
    if (message === t.yes) {
      const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }
      await set(loginCountOf, Number(chatId), { loginCount: loginData.loginCount, canLogin: true })
      send(chatId, t.resetLoginAdmit, trans('o'))
    } else {
      send(chatId, t.resetLoginDeny, trans('o'))
    }
    return
  }

  send(chatId, t.unknownCommand)
})?.then(a => console.log(a))?.catch(b => console.log('the error: ', b))

async function getPurchasedDomains(chatId) {
  let ans = await get(domainsOf, chatId)
  if (!ans) return []

  ans = Object.keys(ans).map(d => d.replaceAll('@', '.')) // de sanitize due to mongo db
  return ans.filter(d => d !== '_id')
}

async function getUsers() {
  let ans = await getAll(chatIdOf)
  if (!ans) return []

  return ans.map(a => a._id)
}

// new Date('2023-9-5'), new Date('2023-9'), new Date('2023')
async function getAnalytics() {
  let ans = await getAll(clicksOf)
  if (!ans) return []
  return ans.map(a => `${a._id}: ${a.val} click${a.val === 1 ? '' : 's'}`).sort((a, b) => a.localeCompare(b))
}


async function getAnalyticsOfAllSms() {
  let ans = await getAll(clicksOfSms)
  if (!ans) return []
  return ans.map(a => `${a._id}, ${a.val}`).sort((a, b) => a.localeCompare(b))
}

async function getShortLinks(chatId) {
  let ans = await get(linksOf, chatId)
  if (!ans) return []

  ans = Object.keys(ans).map(d => ({ shorter: d, url: ans[d] }))
  ans = ans.filter(d => d.shorter !== '_id')

  let ret = []
  for (let i = 0; i < ans.length; i++) {
    const link = ans[i]

    if (link.shorter.includes('ap1s@net')) {
      const lastPart = link.shorter.substring(link.shorter.lastIndexOf('/') + 1)
      let clicks = ((await analyticsCuttly(lastPart)) === 'No such url' ? 0 : (await analyticsCuttly(lastPart))) || 0
      const shorter = (await get(maskOf, link.shorter)) || link.shorter.replaceAll('@', '.')
      ret.push({ clicks, shorter, url: link.url })
    } else {
      let clicks = (await get(clicksOn, link.shorter)) || 0
      const shorter = (await get(maskOf, link.shorter)) || link.shorter.replaceAll('@', '.')
      ret.push({ clicks, shorter, url: link.url })
    }

  }

  return ret
}

async function ownsDomainName(chatId) {
  return (await getPurchasedDomains(chatId)).length > 0
}

async function isValid(link) {
  const time = await get(expiryOf, link)
  if (time === undefined) return true

  return time > Date.now()
}

async function isSubscribed(chatId) {
  const time = await get(planEndingTime, chatId)
  return time && time > Date.now()
}

async function freeLinksAvailable(chatId) {
  const freeLinks = (await get(freeShortLinksOf, chatId)) || 0
  return freeLinks > 0
}


async function backupTheData() {
  const backupData = {
    state: await getAll(state),
    linksOf: await getAll(linksOf),
    walletOf: await getAll(walletOf),
    expiryOf: await getAll(expiryOf),
    fullUrlOf: await getAll(fullUrlOf),
    domainsOf: await getAll(domainsOf),
    loginCountOf: await getAll(loginCountOf),
    canLogin: await getAll(canLogin),
    chatIdBlocked: await getAll(chatIdBlocked),
    planEndingTime: await getAll(planEndingTime),
    chatIdOfPayment: await getAll(chatIdOfPayment),
    totalShortLinks: await getAll(totalShortLinks),
    freeShortLinksOf: await getAll(freeShortLinksOf),
    freeDomainNamesAvailableFor: await getAll(freeDomainNamesAvailableFor),
    freeSmsCountOf: await getAll(freeSmsCountOf),
    clicksOfSms: await getAll(clicksOfSms),
    payments: await getAll(payments),
    clicksOf: await getAll(clicksOf),
    clicksOn: await getAll(clicksOn),
    chatIdOf: await getAll(chatIdOf),
    nameOf: await getAll(nameOf),
    planOf: await getAll(planOf),
  }
  const backupJSON = JSON.stringify(backupData, null, 2)
  fs.writeFileSync('backup.json', backupJSON, 'utf-8')
}

async function backupPayments() {
  const data = await getAll(payments)

  const head = 'Mode, Product, Name, Price, ChatId, User Name, Time,Currency\n'
  const backup = data.map(a => a.val).join('\n')
  fs.writeFileSync('payments.csv', head + backup, 'utf-8')
}

async function buyDomain(chatId, domain) {
  // ref https://www.mongodb.com/docs/manual/core/dot-dollar-considerations
  const domainSanitizedForDb = domain.replaceAll('.', '@')

  // These below two lines are for testing
  // so that real domain is not bought
  // set(domainsOf, chatId, domainSanitizedForDb, true)
  // return { success: true }

  const result = await buyDomainOnline(domain)
  if (result.success) {
    set(domainsOf, chatId, domainSanitizedForDb, true)
  }

  return result
}

const formatLinks = links => {
  return links.map(d => `${d.clicks} ${d.clicks === 1 ? 'click' : 'clicks'} → ${d.shorter} → ${d.url}`)
}

const buyDomainFullProcess = async (chatId, lang, domain) => {
  try {
    const { error: buyDomainError } = await buyDomain(chatId, domain)
    if (buyDomainError) {
      const m = t.domainPurchasedFailed(domain, buyDomainError)
      log(m)
      sendMessage(TELEGRAM_DEV_CHAT_ID, m)
      sendMessage(chatId, m)
      return m
    }
    send(chatId, translation('t.domainBoughtSuccess', lang, domain), translation('o', lang))

    let info = await get(state, chatId)
    if (info?.askDomainToUseWithShortener === translation('t.no', lang)) return

    // saveDomainInServerRender
    const { server, error, recordType } =
      process.env.HOSTED_ON === 'render'
        ? await saveDomainInServerRender(domain)
        : await saveDomainInServerRailway(domain) // save domain in railway // can do separately maybe or just send messages of progress to user

    if (error) {
      const m = translation('t.errorSavingDomain', lang)
      sendMessage(chatId, m)
      return m
    }
    sendMessage(chatId, translation('t.domainLinking', lang, domain))

    await sleep(65000) // sleep 65 seconds so that CR API can get the info that

    const { error: saveServerInDomainError } = await saveServerInDomain(domain, server, recordType)
    if (saveServerInDomainError) {
      const m = `Error saving server in domain ${saveServerInDomainError}`
      sendMessage(chatId, m)
      return m
    }
    sendMessage(chatId, translation('t.domainBought', lang).replaceAll('{{domain}}', domain))
    regularCheckDns(bot, chatId, domain, lang)
    return false // error = false
  } catch (error) {
    const errorMessage = `err buyDomainFullProcess ${error?.message} ${JSON.stringify(error?.response?.data, null, 2)}`
    sendMessage(TELEGRAM_DEV_CHAT_ID, errorMessage)
    console.error(errorMessage)
    return errorMessage
  }
}

const auth = async (req, res, next) => {
  log(req.hostname + req.originalUrl)
  const ref = req?.query?.ref || req?.body?.data?.reference // first for crypto and second for webhook fincra
  const pay = await get(chatIdOfPayment, ref)
  if (!pay) return log(translation('t.payError', 'en')) || res.send(html(translation('t.payError', 'en')))
  req.pay = { ...pay, ref }
  next()
}

const authDyno = async (req, res, next) => {
  log(req.hostname + req.originalUrl)
  const { meta_data } = req.body
  const ref = meta_data.refId // first for crypto and second for webhook fincra
  const pay = await get(chatIdOfDynopayPayment, ref)
  if (!pay) return log(translation('t.payError', 'en')) || res.send(html(translation('t.payError', 'en')))
  req.pay = { ...pay, ref }
  next()
}

const app = express()
app.use(express.json())
app.use(cors())
app.set('json spaces', 2)
let serverStartTime = new Date()

const addFundsTo = async (walletOf, chatId, coin, valueIn, lang) => {
  if (!['usd', 'ngn'].includes(coin)) throw Error('Dev Please Debug')

  const key = `${coin}In`
  await increment(walletOf, chatId, key, valueIn)
  const { usdBal, ngnBal } = await getBalance(walletOf, chatId)
  sendMessage(chatId, translation('t.showWallet', lang, usdBal, ngnBal))
}
//
//
const bankApis = {
  '/bank-pay-plan': async (req, res, ngnIn) => {
    // Validate
    const { ref, chatId, price, plan } = req.pay
    if (!ref || !chatId || !price || !plan) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    if (('' + ref + chatId + price + plan).includes('undefined')) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'

    // Logs
    del(chatIdOfPayment, ref)
    const usdIn = await ngnToUsd(ngnIn)
    const name = await get(nameOf, chatId)
    set(payments, ref, `Bank, Plan, ${plan}, $${usdIn}, ${chatId}, ${name}, ${new Date()}, ₦${ngnIn}`)

    // Update Wallet
    const ngnPrice = await usdToNgn(price)
    if (usdIn * 1.06 < price) {
      sendMessage(chatId, translation('t.sentLessMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
      addFundsTo(walletOf, chatId, 'ngn', ngnIn, lang)
      return res.send(html(translation('t.lowPrice')))
    }
    if (ngnIn > ngnPrice) {
      addFundsTo(walletOf, chatId, 'ngn', ngnIn - ngnPrice, lang)
      sendMessage(chatId, translation('t.sentLessMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
    }

    // Subscribe Plan
    subscribePlan(planEndingTime, freeDomainNamesAvailableFor, planOf, chatId, plan, bot, lang)

    res.send(html())
  },
  '/bank-pay-domain': async (req, res, ngnIn) => {
    // Validate
    const { ref, chatId, price, domain } = req.pay
    if (!ref || !chatId || !price || !domain) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'

    // Logs
    del(chatIdOfPayment, ref)
    const usdIn = await ngnToUsd(ngnIn)
    const name = await get(nameOf, chatId)
    set(payments, ref, `Bank, Domain, ${domain}, $${usdIn}, ${chatId}, ${name}, ${new Date()}, ₦${ngnIn}`)

    // Update Wallet
    const ngnPrice = await usdToNgn(price)
    if (usdIn * 1.06 < price) {
      sendMessage(chatId, translation('t.sentLessMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
      addFundsTo(walletOf, chatId, 'ngn', ngnIn, lang)
      return res.send(html(translation('t.lowPrice')))
    }
    if (ngnIn > ngnPrice) {
      addFundsTo(walletOf, chatId, 'ngn', ngnIn - ngnPrice, lang)
      sendMessage(chatId, translation('t.sentMoreMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
    }

    // Buy Domain
    const error = await buyDomainFullProcess(chatId, lang, domain)
    if (error) return res.send(html(error))

    res.send(html())
  },
  '/bank-pay-hosting': async (req, res, ngnIn) => {
    // Validate
    const { ref, chatId, price } = req.pay
    const response = req?.query
    if (!ref || !chatId || !price) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'

    // Logs
    del(chatIdOfPayment, ref)
    const usdIn = await ngnToUsd(ngnIn)
    await insert(hostingTransactions, chatId, "bank", response)

    // Update Wallet
    const ngnPrice = await usdToNgn(price)
    if (usdIn * 1.06 < price) {
      sendMessage(chatId, translation('t.sentLessMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
      addFundsTo(walletOf, chatId, 'ngn', ngnIn, lang)
      return res.send(html(translation('t.lowPrice')))
    }
    if (ngnIn > ngnPrice) {
      addFundsTo(walletOf, chatId, 'ngn', ngnIn - ngnPrice, lang)
      sendMessage(chatId, translation('t.sentMoreMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
    }

    // Buy Domain Hosting
    await registerDomainAndCreateCpanel(send, info, translation('o', lang), state)

    res.send(html())
  },
  '/bank-wallet': async (req, res, ngnIn) => {
    // Validate
    const { ref, chatId } = req.pay
    if (!ref || !chatId) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'

    // Update Wallet
    const usdIn = await ngnToUsd(ngnIn)
    addFundsTo(walletOf, chatId, 'ngn', ngnIn, lang)
    sendMessage(chatId, translation('t.confirmationDepositMoney', lang, `${ngnIn} NGN`, usdIn))

    // Logs
    res.send(html())
    del(chatIdOfPayment, ref)
    const name = await get(nameOf, chatId)
    set(payments, ref, `Bank,Wallet,wallet,$${usdIn},${chatId},${name},${new Date()},${ngnIn} NGN`)
  },
}
//
//
app.post('/webhook', auth, (req, res) => {
  const value = req?.body?.data?.amountReceived
  const coin = req?.body?.data?.currency
  const endpoint = req?.pay?.endpoint
  if (coin !== 'NGN' || isNaN(value) || !bankApis[endpoint]) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))

  bankApis[endpoint](req, res, Number(value))
})

app.get('/open-api-key', async (req, res) => {
  const openApiKey = process.env.APP_OPEN_API_KEY
  const length = Math.ceil(openApiKey.length / 3)
  const piece1 = openApiKey.substring(0, length)
  const piece2 = openApiKey.substring(length, length * 2)
  const piece3 = openApiKey.substring(length * 2)

  const responseJson = {
    piece1: piece1,
    piece2: piece3,
    piece3: piece2,
  }

  res.json(responseJson)
})

app.get('/bot-link', async (req, res) => {
  res.send(process.env.APP_SUPPORT_LINK)
})

app.get('/free-sms-count/:chatId', async (req, res) => {
  const chatId = req?.params?.chatId
  let _count = (await get(freeSmsCountOf, Number(chatId))) || 0
  res.send('' + _count)
})

app.get('/increment-free-sms-count/:chatId', async (req, res) => {
  const chatId = req?.params?.chatId
  const name = await get(nameOf, Number(chatId))

  increment(freeSmsCountOf, Number(chatId))
  increment(clicksOfSms, chatId + ', ' + name + ', ' + today())
  increment(clicksOfSms, chatId + ', ' + name + ', ' + week())
  increment(clicksOfSms, chatId + ', ' + name + ', ' + month())
  increment(clicksOfSms, chatId + ', ' + name + ', ' + year())

  increment(clicksOfSms, 'total, total, ' + today())
  increment(clicksOfSms, 'total, total, ' + week())
  increment(clicksOfSms, 'total, total, ' + month())
  increment(clicksOfSms, 'total, total, ' + year())
  res.send('ok')
})


app.get('/analytics-of-all-sms', async (req, res) => {
  const analyticsData = await getAnalyticsOfAllSms()
  const analyticsText = `chat id, name, date, sms sent\n${analyticsData.join('\n')}`
  const fileName = 'analytics.csv'
  fs.writeFileSync(fileName, analyticsText, 'utf-8')
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
  res.setHeader('Content-Type', 'application/json')
  fs.createReadStream(fileName).pipe(res)
})
app.get('/login-count/:chatId', async (req, res) => {
  const chatId = req?.params?.chatId
  const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }
  if (!loginData.canLogin) {
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'
    send(Number(chatId), translation('t.resetLogin', lang), trans('yes_no'))
    // sendMessage(Number(chatId), t.resetLogin, yes_no)
    await set(state, Number(chatId), 'action', 'listen_reset_login')
  }
  res.json(loginData)
})

app.get('/increment-login-count/:chatId', async (req, res) => {
  const chatId = req?.params?.chatId

  const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }
  await set(loginCountOf, Number(chatId), { loginCount: loginData.loginCount + 1, canLogin: false })

  res.send('ok')
})

app.get('/decrement-login-count/:chatId', async (req, res) => {
  const chatId = req?.params?.chatId

  const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }

  if (loginData.canLogin) return res.send('!ok')

  await set(loginCountOf, Number(chatId), { loginCount: loginData.loginCount - 1, canLogin: true })

  res.send('ok')
})
app.get('/phone-numbers-demo-link', async (req, res) => {
  res.send(process.env.APP_PHONE_NUMBERS_DEMO_LINK)
})

app.get('/content-demo-link', async (req, res) => {
  res.send(process.env.APP_CONTENT_DEMO_LINK)
})

app.get('/free-sms', async (req, res) => {
  res.send(process.env.APP_FREE_SMS)
})

app.get('/crypto-pay-plan', auth, async (req, res) => {
  // Validate
  const { ref, chatId, price, plan } = req.pay
  const coin = req?.query?.coin
  const value = req?.query?.value_coin

  console.log({ method: '/crypto-pay-plan', ref, chatId, plan, price, coin, value })

  if (!ref || !chatId || !plan || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))

  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'

  // Logs
  del(chatIdOfPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Plan,${plan},$${price},${chatId},${name},${new Date()},${value} ${coin}`)

  // Update Wallet
  const usdIn = await convert(value, coin, 'usd')
  const usdNeed = usdIn * 1.06
  console.log(`usdIn ${usdIn}, usdNeed ${usdNeed}, Crypto, Plan, ${chatId}, ${name}`)
  if (usdNeed < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  console.log(`usdIn > price = ${usdIn > price}`)
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  // Subscribe Plan
  subscribePlan(planEndingTime, freeDomainNamesAvailableFor, planOf, chatId, plan, bot, lang)
  res.send(html())
})
app.get('/crypto-pay-domain', auth, async (req, res) => {
  // Validate
  const { ref, chatId, price, domain } = req.pay
  const coin = req?.query?.coin
  const value = req?.query?.value_coin
  if (!ref || !chatId || !domain || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'
  // Logs
  del(chatIdOfPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Domain,${domain},$${price},${chatId},${name},${new Date()},${value} ${coin}`)

  // Update Wallet
  const usdIn = await convert(value, coin, 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  // Buy Domain
  const error = await buyDomainFullProcess(chatId, lang, domain)
  if (error) return res.send(html(error))
  res.send(html())
})

// Hosting
app.get('/crypto-pay-hosting', auth, async (req, res) => {
  // Validate
  const { ref, chatId, price } = req.pay
  const coin = req?.query?.coin
  const value = req?.query?.value_coin
  const response = req?.query

  if (!ref || !chatId || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'

    // Logs
  del(chatIdOfPayment, ref)
  await insert(hostingTransactions, chatId, "blockbee", response)
  // Update Wallet
  const usdIn = await convert(value, coin, 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  await registerDomainAndCreateCpanel(send, info, translation('o', lang), state)

  res.send(html())
})
app.get('/crypto-wallet', auth, async (req, res) => {
  // Validate
  const { ref, chatId } = req.pay
  const coin = req?.query?.coin
  const value = req?.query?.value_coin
  if (!ref || !chatId || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'

  // Update Wallet
  const usdIn = await convert(value, coin, 'usd')
  addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
  sendMessage(chatId, translation('t.confirmationDepositMoney', lang, value + ' ' + tickerViewOf[coin], usdIn))

  // Logs
  res.send(html())
  del(chatIdOfPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Wallet,wallet,$${usdIn},${chatId},${name},${new Date()},${value} ${coin}`)
})

// Dynopay Pay plan
app.post('/dynopay/crypto-pay-plan', authDyno, async (req, res) => {
  // Validate
  const { ref, chatId, price, plan } = req.pay
  const { paid_amount:value , paid_currency:coin, id } = req.body

  log({ method: 'dynopay/crypto-pay-plan', ref, chatId, plan, price, coin, value })

  if (!ref || !chatId || !plan || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'

  // Logs
  del(chatIdOfDynopayPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Plan,${plan},$${price},${chatId},${name},${new Date()},${value} ${coin},transaction,${id}`)

  // Update Wallet
  // Update Wallet
  const ticker = tickerViewOfDyno[coin]
  const usdIn = await convert(value, ticker , 'usd')  
  const usdNeed = usdIn * 1.06
  console.log(`usdIn ${usdIn}, usdNeed ${usdNeed}, Crypto, Plan, ${chatId}, ${name}`)
  if (usdNeed < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  console.log(`usdIn > price = ${usdIn > price}`)
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  // Subscribe Plan
  subscribePlan(planEndingTime, freeDomainNamesAvailableFor, planOf, chatId, plan, bot, lang)
  res.send(html())
})

// Dynopay Domain
app.post('/dynopay/crypto-pay-domain', authDyno, async (req, res) => {
  // Validate
  const { ref, chatId, price, domain } = req.pay
  const { paid_amount:value , paid_currency:coin, id } = req.body

  log({ method: 'dynopay/crypto-pay-domain', ref, chatId, domain, price, coin, value })

  if (!ref || !chatId || !domain || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))

  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'

  // Logs
  del(chatIdOfDynopayPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Domain,${domain},$${price},${chatId},${name},${new Date()},${value} ${coin},transaction,${id}`)

  // Update Wallet
  const ticker = tickerViewOfDyno[coin]
  const usdIn = await convert(value, ticker , 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, trans('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  // Buy Domain
  const error = await buyDomainFullProcess(chatId, lang, domain)
  if (error) return res.send(html(error))
  res.send(html())
})

// Dynopay Hosting
app.post('/dynopay/crypto-pay-hosting', authDyno, async (req, res) => {
  // Validate
  const { ref, chatId, price } = req.pay
  const { paid_amount:value , paid_currency:coin } = req.body

  log({ method: 'dynopay/crypto-pay-hosting', ref, chatId, price, coin, value })

  if (!ref || !chatId || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'
    // Logs
  del(chatIdOfDynopayPayment, ref)
  await insert(hostingTransactions, chatId, "dynopay", req.body)
  // Update Wallet
  const ticker = tickerViewOfDyno[coin]
  const usdIn = await convert(value, ticker , 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  await registerDomainAndCreateCpanel(send, info, translation('o', lang), state)

  res.send(html())
})

// Dynopay wallet 
app.post('/dynopay/crypto-wallet', authDyno, async (req, res) => {
  // Validate
  const { ref, chatId } = req.pay
  const { paid_amount:value , paid_currency:coin, id } = req.body
  log({ method: 'dynopay/crypto-pay-wallet', ref, chatId, coin, value })
  if (!ref || !chatId || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'

  // Update Wallet
  const ticker = tickerViewOfDyno[coin]
  const usdIn = await convert(value, ticker , 'usd')
  addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
  sendMessage(chatId, translation('t.confirmationDepositMoney' , lang, value + ' ' + coin, usdIn))

  // Logs
  res.send(html())
  del(chatIdOfDynopayPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Wallet,wallet,$${usdIn},${chatId},${name},${new Date()},${value} ${coin},transaction,${id}`)
})

//
app.get('/', (req, res) => {
  res.send(html(translation('t.greet')))
})

app.get('/terms-condition', (req, res) => {
  const { lang } = req.query
  res.send(html(translation('l.termsAndCondMsg', lang)))
})

app.get('/ok', (req, res) => {
  res.send(html('ok'))
})
app.get('/woo', (req, res) => {
  log(req.hostname + req.originalUrl)
  res.send(html('woo'))
})
app.get('/health', (req, res) => {
  res.send(html('health ok'))
})
app.get('/json1444', async (req, res) => {
  await backupTheData()
  const fileName = 'backup.json'
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
  res.setHeader('Content-Type', 'application/json')
  fs.createReadStream(fileName).pipe(res)
})
app.get('/payments12341234', async (req, res) => {
  await backupPayments()
  const fileName = 'payments.csv'
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
  res.setHeader('Content-Type', 'application/json')
  fs.createReadStream(fileName).pipe(res)
})
app.get('/uptime', (req, res) => {
  let now = new Date()
  let uptimeInMilliseconds = now - serverStartTime
  let uptimeInHours = uptimeInMilliseconds / (1000 * 60 * 60)
  res.send(html(`Server has been running for ${uptimeInHours.toFixed(2)} hours.`))
})
//
app.get('/subscribe', (req, res) => {
  const phone = req?.query?.Phone
  const name = req?.query?.['full-name']

  log({ phone, name })
  res.send(html(translation('t.subscribeRCS', null, phone)))
})
app.get('/unsubscribe', (req, res) => {
  const phone = req?.query?.Phone

  log({ phone })
  res.send(html(translation('t.subscribeRCS', null, phone)))
})

app.get('/planInfo', async (req, res) => {
  if (process.env.OLD_APP_ACTIVE === 'false') return res.send('old app off now')

  const chatId = Number(req?.query?.code)
  if (isNaN(chatId)) return res.status(400).json({ msg: 'Issue in datatype' })
  const name = await get(nameOf, chatId)

  if (!name) return res.json({ planExpiry: 'invalid' })
  const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }
  return res.json({
    pauseTime: 10 * 1000,
    planExpiry: (await get(planEndingTime, chatId)) || 0,
    loginCount: loginData.loginCount,
  })
})

app.get('/planInfoTwo', async (req, res) => {
  const chatId = Number(req?.query?.code)
  if (isNaN(chatId)) return res.status(400).json({ msg: 'Issue in datatype' })
  const name = await get(nameOf, chatId)

  if (!name) return res.json({ planExpiry: 'invalid' })
  const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }
  return res.json({
    pauseTime: 10 * 1000,
    planExpiry: (await get(planEndingTime, chatId)) || 0,
    loginCount: loginData.loginCount,
    name,
  })
})
//
app.get('/:id', async (req, res) => {
  const id = req?.params?.id
  if (id === '') return res.json({ message: 'Salam', from: req.hostname })

  const shortUrl = `${req.hostname}/${id}`
  const shortUrlSanitized = shortUrl.replaceAll('.', '@')
  const url = await get(fullUrlOf, shortUrlSanitized)
  if (!url) return res.status(404).send(html('Link not found'))
  if (!(await isValid(shortUrlSanitized))) return res.status(404).send(html(translation('t.linkExpired')))

  res.redirect(url)
  increment(clicksOf, 'total')
  increment(clicksOf, today())
  increment(clicksOf, week())
  increment(clicksOf, month())
  increment(clicksOf, year())
  increment(clicksOn, shortUrlSanitized)
})
const startServer = () => {
  const port = process.env.PORT || 4001
  app.listen(port, () => log(`Server ran away! http://localhost:${port}`))
}

const tryConnectReseller = async () => {
  try {
    await getRegisteredDomainNames()
    connect_reseller_working = true
  } catch (error) {
    //
    axios
      .get('https://api.ipify.org/')
      .then(ip => {
        const message = `Please add <code>${ip.data}</code> to whitelist in Connect Reseller, API Section. https://global.connectreseller.com/tools/profile`
        send(TELEGRAM_DEV_CHAT_ID, message, { parse_mode: 'HTML' })
        send(TELEGRAM_ADMIN_CHAT_ID, message, { parse_mode: 'HTML' })
      })
      .catch(error => {
        console.log('Error:', error?.message, JSON.stringify(error?.response?.data, 0, 2))
      })
    //
  }
}

tryConnectReseller()
