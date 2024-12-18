const { areasOfCountry, carriersOf, countryCodeOf } = require('../areasOfCountry')

const format = (cc, n) => `+${cc}(${n.toString().padStart(2, '0')})`

/* global process */
require('dotenv').config()
const HIDE_BANK_PAYMENT = process.env.HIDE_BANK_PAYMENT
const SELF_URL = process.env.SELF_URL
const FREE_LINKS = Number(process.env.FREE_LINKS)
const SUPPORT_USERNAME = process.env.SUPPORT_USERNAME

const HIDE_SMS_APP = process.env.HIDE_SMS_APP
const HIDE_BECOME_RESELLER = process.env.HIDE_BECOME_RESELLER
const TG_HANDLE = process.env.TG_HANDLE
const TG_CHANNEL = process.env.TG_CHANNEL
const SMS_APP_NAME = process.env.SMS_APP_NAME
const SMS_APP_LINK = process.env.SMS_APP_LINK
const CHAT_BOT_NAME = process.env.CHAT_BOT_NAME
const CHAT_BOT_BRAND = process.env.CHAT_BOT_BRAND
const SUPPORT_HANDLE = process.env.SUPPORT_HANDLE
const APP_SUPPORT_LINK = process.env.APP_SUPPORT_LINK

const PRICE_DAILY = Number(process.env.PRICE_DAILY_SUBSCRIPTION)
const PRICE_WEEKLY = Number(process.env.PRICE_WEEKLY_SUBSCRIPTION)
const PRICE_MONTHLY = Number(process.env.PRICE_MONTHLY_SUBSCRIPTION)
const DAILY_PLAN_FREE_DOMAINS = Number(process.env.DAILY_PLAN_FREE_DOMAINS)
const WEEKLY_PLAN_FREE_DOMAINS = Number(process.env.WEEKLY_PLAN_FREE_DOMAINS)
const FREE_LINKS_HOURS = Number(process.env.FREE_LINKS_TIME_SECONDS) / 60 / 60
const MONTHLY_PLAN_FREE_DOMAINS = Number(process.env.MONTHLY_PLAN_FREE_DOMAINS)

const HOSTING_STARTER_PLAN_PRICE = parseFloat(process.env.HOSTING_STARTER_PLAN_PRICE)
const HOSTING_PRO_PLAN_PRICE = parseFloat(process.env.HOSTING_PRO_PLAN_PRICE)
const HOSTING_BUSINESS_PLAN_PRICE = parseFloat(process.env.HOSTING_BUSINESS_PLAN_PRICE)

const npl = {
  // New Zealand
  Spark: ['Spark'],
  Vocus: ['Vocus'],
  '2Degrees/Voyager': ['Voyager'],
  'Skinny Mobile': ['Skinny Mobile'],
  // Australia
  Telstra: ['Telstra'],
  Optus: ['Optus'],
  Vodafone: ['VODAFONE', 'Vodafone'],
  // UK
  EE: ['EE'],
  Three: ['Three'],
  'Virgin/O2': ['Virgin'],
}

const alcazar = {
  'T-mobile': ['T-MOBILE', 'OMNIPOINT', 'METROPCS', 'SPRINT', 'AERIAL'],
  'Metro PCS': ['T-MOBILE', 'OMNIPOINT', 'METROPCS', 'SPRINT', 'AERIAL'],
  Sprint: ['T-MOBILE', 'OMNIPOINT', 'METROPCS', 'SPRINT', 'AERIAL'],
  'Verizon Wireless': ['CELLCO', 'ONVOY'],
  'AT&T': ['CINGULAR'],
}

// Note: these button labels must not mix with each other, other wise it may mess up bot
const admin = {
  viewAnalytics: '📊 View Analytics',
  viewUsers: '👀 View Users',
  blockUser: '✋ Block User',
  unblockUser: '👌 Unblock User',
  messageUsers: '👋 Message all users',
}
const user = {
  // main keyboards
  cPanelWebHostingPlans: 'Private cPanel Hosting Plans 🔒',
  pleskWebHostingPlans: 'Private Plesk Hosting Plans 🔒',
  joinChannel: '📢 Join Channel',
  phoneNumberLeads: '📲 HQ SMS Lead',
  wallet: '👛 My Wallet',
  urlShortenerMain: '🔗✂️ URL Shortener',
  buyPlan: '🔔 Subscribe Here',
  domainNames: '🌐 Domain Names',
  viewPlan: '🔔 My Plan',
  becomeReseller: '💼 Become A Reseller',
  getSupport: '💬 Get Support',
  freeTrialAvailable: '📧🆓 BulkSMS -Trial',
  changeSetting: '🌍 Change Settings',

  // Sub Menu 1: urlShortenerMain
  redSelectUrl: '🔀✂️ Redirect & Shorten',
  urlShortener: '✂️🌐 Custom Domain Shortener',
  viewShortLinks: '📊 View Shortlink Analytics',

  // Sub Menu 2: domainNames
  buyDomainName: '🛒🌐 Buy Domain Names',
  viewDomainNames: '📂 My Domain Names',
  dnsManagement: '🔧 DNS Management',

  // Sub Menu 3: cPanel/Plesk WebHostingPlansMain
  freeTrial: '💡 Free Trial',
  starterPlan: '🔼 Starter Plan',
  proPlan: '🔷 Pro Plan',
  businessPlan: '👑 Business Plan',
  contactSupport: '📞 Contact Support',

  // Free Trial
  freeTrialMenuButton: '🚀 Free Trial (12 Hours)',
  getFreeTrialPlanNow: '🛒 Get Trial Plan Now',
  continueWithDomainNameSBS: websiteName => `➡️ Continue with ${websiteName}`,
  searchAnotherDomain: `🔍 Search Another Domain`,
  privHostNS: `🏢 PrivHost (Fast & Secure Hosting)`,
  cloudflareNS: `🛡️ Cloudflare Shield (Security & Stealth)`,
  backToFreeTrial: '⬅️ Back To Free Trial',

  // Paid Plans
  buyStarterPlan: '🛒 Buy Starter Plan',
  buyProPlan: '🛒 Buy Pro Plan',
  buyBusinessPlan: '🛒 Buy Business Plan',
  viewStarterPlan: '🔷 View Starter Plan',
  viewProPlan: '🔼 View Pro Plan',
  viewBusinessPlan: '👑 View Business Plan',
  backToHostingPlans: '⬅️ Back To Hosting Plans',
  registerANewDomain: '🌐 Register a New Domain',
  useExistingDomain: '🔄 Use Existing Domain',
  backToStarterPlanDetails: '⬅️ Back to Starter Plan Details',
  backToProPlanDetails: '⬅️ Back to Pro Plan Details',
  backToBusinessPlanDetails: '⬅️ Back to Business Plan Details',
  continueWithDomain: websiteName => `➡️ Continue with ${websiteName}`,
  enterAnotherDomain: '🔍 Enter Another Domain',
  backToPurchaseOptions: '⬅️ Back to Purchase Options',
}
const u = {
  // other key boards
  deposit: '➕💵 Deposit',
  withdraw: '➖💵 Withdraw',

  // wallet
  usd: 'USD',
  ngn: 'NGN',
}
const view = num => Number(num).toFixed(2)
const yesNo = ['Yes', 'No']

const bal = (usd, ngn) =>
  HIDE_BANK_PAYMENT !== 'true'
    ? `$${view(usd)}
₦${view(ngn)}`
    : `$${view(usd)}`

const t = {
  yes: 'Yes',
  no: 'No',
  back: 'Back',
  cancel: 'Cancel',
  skip: 'Skip',
  becomeReseller: `Hi,

I'm reaching out to offer you a fantastic opportunity to become a reseller for ${CHAT_BOT_BRAND}Bot's powerful SMS marketing and hosting software.

Key Details:

Profit Share: Earn a competitive 65/35% split on each sale.

Set-up Fee: Contact support for details

Interested? Reach out to us at ${SUPPORT_HANDLE} to learn more about this lucrative partnership.

Looking forward to potentially collaborating with you!

Best regards,

${CHAT_BOT_BRAND} Team
`,
  resetLoginAdmit: `${CHAT_BOT_BRAND} SMS: You have been successfully logged out of your previous device.Please login now`,
  resetLoginDeny: 'Ok sure. No further action required.',
  resetLogin: `${CHAT_BOT_BRAND}SMS: Are you trying to log out of your previous device?`,
  select: `Please select an option:`,

  // cPanel/Plesk Plans initial select plan text
  selectPlan: `Please select a plan:`,
  backButton: '⬅️ Back',
  yesProceedWithThisEmail: email => `➡️ Proceed with ${email}`,
  proceedWithPayment: '➡️ Proceed with Payment',
  iHaveSentThePayment: `I Have Sent the Payment ✅`,
  // Free Plan
  trialAlreadyUsed: `You have already utilized your free trial. If you need more access, please consider subscribing to one of our paid plans.`,
  oneHourLeftToExpireTrialPlan: `Your Freedom Plan will expire in 1 hour. If you’d like to continue using our services, consider upgrading to a paid plan!`,
  freePlanExpired: `🚫 Your Freedom Plan has expired. We hope you enjoyed your trial,
To continue using our services, please buy one of our premium plans.`,
  freeTrialPlanSelected: hostingType => `
- Try our <b>Freedom Plan</b> for free! This plan includes a free domain
  ending in .sbs and will be active for 12 hours.

🚀 <b>Freedom Plan:</b>
<b>- Storage:</b> 1 GB SSD
<b>- Bandwidth:</b> 10 GB
<b>- Domains:</b> 1 free .sbs domain
<b>- Email Accounts:</b> 1 email account
<b>- Databases:</b> 1 MySQL database
<b>- Free SSL:</b> Yes
<b>- ${hostingType} Features:</b> Full access to ${hostingType} for managing files,
  database & emails etc.
<b>- Duration:</b> Active for 12 hours
<b>- Ideal for:</b> Testing and short-term projects.
  `,
  getFreeTrialPlan: `Please enter your desired domain name (e.g., example.sbs) and send it as a message. This domain will end in .sbs and is free with your trial plan.`,
  trialPlanContinueWithDomainNameSBSMatched: websiteName => `The domain ${websiteName} is available!`,
  trialPlanSBSDomainNotMatched: `The domain you entered could not be found. Please ensure the right domain or try using a different one.`,
  trialPlanSBSDomainIsPremium: `Domain is premium price and available only with a paid plan. Please search for another domain.`,
  trialPlanGetNowInvalidDomain:
    "Please enter a valid domain name that ends with '.sbs'. The domain should look like 'example.sbs' and is free with your trial plan.",
  trialPlanNameserverSelection: websiteName =>
    `Please select the nameserver provider you would like to use for ${websiteName}.`,
  trialPlanDomainNameMatched: `Please provide your email address to create your account and send your receipt.`,
  confirmEmailBeforeProceedingSBS: email =>
    `Are you sure you want to proceed with this ${email} email for the Freedom Plan subscription?`,
  trialPlanInValidEmail: 'Please provide a valid email',
  trialPlanActivationConfirmation: `Thank you! Your free trial plan will be activated shortly. Please note, this plan will be active for 12 hours only.`,
  trialPlanActivationInProgress: `Your free trial plan is being activated. This may take a few moments…`,

  what: `Please choose option from keyboard`,
  whatNum: `Please choose valid number`,
  phoneGenTimeout: 'Timeout',
  phoneGenNoGoodHits: `Please contact support ${SUPPORT_HANDLE} or select another area code`,

  subscribeRCS: p =>
    `Subscribed! Unsubscribe anytime by clicking the <a href="${SELF_URL}/unsubscribe?a=b&Phone=${p}">link</a>`,
  unsubscribeRCS: p =>
    `You are unsubscribed! To subscribe again click on the <a href="${SELF_URL}/subscribe?a=b&Phone=${p}">link</a>`,
  argsErr: `dev: sent wrong args`,
  showDepositNgnInfo:
    ngn => `Please remit ${ngn} NGN by clicking “Make Payment” below. Once the transaction has been confirmed, you will be promptly notified, and your wallet will updated.

Best regards,
${CHAT_BOT_NAME}`,

  askEmail: `Please provide an email for payment confirmation.`,
  askValidAmount: 'Please provide a valid number',
  askValidEmail: 'Please provide a valid email',
  askValidCrypto: 'Please choose a valid crypto currency',
  askValidPayOption: 'Please choose a valid payment option',
  chooseSubscription:
    HIDE_SMS_APP === 'true'
      ? `<b>Elevate Your Brand with Our Subscription Plans!</b>

- <b>Daily:</b> $${PRICE_DAILY} with ${DAILY_PLAN_FREE_DOMAINS} free ".sbs" domains, unlimited URL shortner.
- <b>Weekly:</b> $${PRICE_WEEKLY} with ${WEEKLY_PLAN_FREE_DOMAINS} free ".sbs" domains, unlimited URL shortner.
- <b>Monthly:</b> $${PRICE_MONTHLY} with ${MONTHLY_PLAN_FREE_DOMAINS} free ".sbs" domains, unlimited URL shortner.

(Exclusive to ".sbs" domains.)`
      : `<b>Elevate Your Brand with Our Subscription Plans!</b>

- <b>Daily:</b> $${PRICE_DAILY} with ${DAILY_PLAN_FREE_DOMAINS} free ".sbs" domains, unlimited URL shortner and unlimited BulkSMS.
- <b>Weekly:</b> $${PRICE_WEEKLY} with ${WEEKLY_PLAN_FREE_DOMAINS} free ".sbs" domains, unlimited URL shortner and unlimited BulkSMS.
- <b>Monthly:</b> $${PRICE_MONTHLY} with ${MONTHLY_PLAN_FREE_DOMAINS} free ".sbs" domains, unlimited URL shortner and unlimited BulkSMS.

(Exclusive to ".sbs" domains.)`,

  askCoupon: usd =>
    `The price is $${usd}. Would you like to apply a coupon code? If you have one, please enter it now. Otherwise, you can press 'Skip'.`,
  planAskCoupon: `Would you like to apply a coupon code? If you have one, please enter it now. Otherwise, you can press 'Skip'.`,
  enterCoupon: `Please enter a coupon code:`,
  planPrice: (plan, price) => `Price of ${plan} subscription is $${price} Please choose payment method.`,
  planNewPrice: (plan, price, newPrice) =>
    `Price of ${plan} subscription is now $${view(newPrice)} <s>($${price})</s> Please choose payment method.`,

  domainPrice: (domain, price) => `Price of ${domain} is ${price} USD. Choose payment method.`,
  domainNewPrice: (domain, price, newPrice) =>
    `Price of ${domain} is now $${view(newPrice)} <s>($${price})</s> Choose payment method.`,

  couponInvalid: `Invalid coupon code, Please enter your coupon code again:`,

  lowPrice: `Sent price less than needed`,

  freeTrialAvailable: `Your BulkSMS free trial is now enabled. Please download the ${SMS_APP_NAME} Android App here: ${SMS_APP_LINK}. Need E-sim cards? Contact ${SUPPORT_HANDLE}`,

  freeTrialNotAvailable: 'You have already used the free trial',

  planSubscribed:
    HIDE_SMS_APP === 'true'
      ? `You have successfully subscribed to our {{plan}} plan. Enjoy our URL-shortening logics and ${SMS_APP_NAME}. Need E-sim card? contact ${SUPPORT_HANDLE}`
      : `You have successfully subscribed to our {{plan}} plan. Enjoy our URL-shortening logics and ${SMS_APP_NAME}. Please download the app here: ${SMS_APP_LINK}. Need E-sim card? contact ${SUPPORT_HANDLE}`,

  alreadySubscribedPlan: days => `Your subscription is active and expires in ${days}`,

  payError: `Payment session not found, please try again or contact support ${SUPPORT_USERNAME}. Discover more ${TG_HANDLE}.`,

  chooseFreeDomainText: `<b>Great News!</b> This domain is available for free with your subscription. Would you like to claim it?`,

  chooseDomainToBuy: text =>
    `<b>Claim Your Corner of the Web!</b>  Please share the domain name you wish to purchase, like "abcpay.com".${text}`,
  askDomainToUseWithShortener: `Do you wish to use domain with the shortener?`,
  blockUser: `Please share the username of the user that needs to be blocked.`,
  unblockUser: `Please share the username of the user that needs to be unblocked.`,
  blockedUser: `You are currently blocked from using the bot. Please contact support ${SUPPORT_USERNAME}. Discover more ${TG_HANDLE}.`,

  greet: `Keep your eyes on this space! We're gearing up to launch our URL shortening application that will make your links short, sweet, and to the point. Stay tuned for our big reveal!

Support ${SUPPORT_USERNAME} at Telegram.`,

  linkExpired: `Your ${CHAT_BOT_BRAND} trial has ended and your short link is deactivated. We invite you to subscribe to maintain access to our URL service and free domain names. Choose a suitable plan and follow the instructions to subscribe. Please Contact us for any queries.
Best,
${CHAT_BOT_BRAND} Team
Discover more: ${TG_CHANNEL}`,

  successPayment: `Payment Processed Successfully! You can now close this window.`,

  welcome: `Thank you for choosing ${CHAT_BOT_NAME}! Please choose an option below:`,
  welcomeFreeTrial: `Welcome to ${CHAT_BOT_BRAND}! Enjoy our one-time free trial - shorten ${FREE_LINKS} URLs, active for ${FREE_LINKS_HOURS} hours. Experience the ${CHAT_BOT_BRAND} difference!`,

  unknownCommand: `Command not found. Press /start or Please contact support ${SUPPORT_USERNAME}. Discover more ${TG_HANDLE}.`,

  support: `Please contact support ${SUPPORT_USERNAME}. Discover more ${TG_HANDLE}.`,

  joinChannel: `Please Join Channel ${TG_CHANNEL}`,

  dnsPropagated: `DNS Propagation for {{domain}} is completed for unlimited URL Shortening.`,

  dnsNotPropagated: `DNS propagation for {{domain}} is in progress and you will be updated once it completes. ✅`,

  domainBoughtSuccess: domain => `Domain ${domain} is now yours. Thank you for choosing us.

Best,
${CHAT_BOT_NAME}`,

  domainBought: `Your domain {{domain}} is now linked to your account while DNS propagates. You will be updated automatically about the status momentarily.🚀`,

  domainLinking: domain =>
    `Linking domain with your account. Please note that DNS updates can take up to 30 minutes. You can check your DNS update status here: https://www.whatsmydns.net/#A/${domain}`,

  errorSavingDomain: `Error saving domain in server, contact support ${SUPPORT_USERNAME}. Discover more ${TG_HANDLE}.`,

  chooseDomainToManage: `Please select a domain if you wish to manage its DNS settings.`,

  chooseDomainWithShortener: `Please select or buy the domain name you would like to connect with your shortened link.`,

  viewDnsRecords: `Here are DNS Records for {{domain}}`,
  addDns: 'Add DNS Record',
  updateDns: 'Update DNS Record',
  deleteDns: 'Delete DNS Record',
  addDnsTxt: 'Please select record type you want to add:',
  updateDnsTxt: 'Please type the record id you wish to update. i.e 3',
  deleteDnsTxt: 'Please type the record id you wish to delete. i.e 3',
  confirmDeleteDnsTxt: 'Are you sure? Yes or No',
  a: 'A Record',
  cname: 'CNAME Record',
  ns: 'NS Record',
  'A Record': 'A',
  'CNAME Record': 'CNAME',
  'NS Record': 'NS',
  askDnsContent: {
    A: `Please provide A record. i.e, 108.0.56.98`,
    'A Record': `Please provide A record. i.e, 108.0.56.98`,

    CNAME: `Please provide CNAME record. i.e, abc.hello.org`,
    'CNAME Record': `Please provide CNAME record. i.e, abc.hello.org`,

    NS: `Please enter your NS record. i.e., dell.ns.cloudflare.com. A new NS record will be added to the current ones.`,
    'NS Record': `Please enter your NS record. i.e., dell.ns.cloudflare.com .If N1-N4 already exists, please update record instead`,
  },
  askUpdateDnsContent: {
    A: `Please provide A record. i.e, 108.0.56.98`,
    'A Record': `Please provide A record. i.e, 108.0.56.98`,

    CNAME: `Please provide CNAME record. i.e, abc.hello.org`,
    'CNAME Record': `Please provide CNAME record. i.e, abc.hello.org`,

    NS: `A new NS record will be updated for the selected id. To Add a new record, please choose “Add DNS Record”`,
    'NS Record': `A new NS record will be updated for the selected id. To Add a new record, please choose “Add DNS Record”`,
  },

  dnsRecordSaved: `Record Added`,
  dnsRecordDeleted: `Record Deleted`,
  dnsRecordUpdated: `Record Updated`,

  provideLink: 'Please provide a valid URL. e.g https://google.com',

  comingSoonWithdraw: `Withdraw coming soon. Contact support ${SUPPORT_USERNAME}. Discover more ${TG_HANDLE}.`,

  selectCurrencyToDeposit: `Please select currency to deposit`,

  depositNGN: `Please enter NGN Amount:`,
  askEmailForNGN: `Please provide an email for payment confirmation`,

  depositUSD: `Please enter USD Amount, note that minium value is $6:`,
  selectCryptoToDeposit: `Please choose a crypto currency:`,

  'bank-pay-plan': (
    priceNGN,
    plan,
  ) => `Please remit ${priceNGN} NGN by clicking “Make Payment” below. Once the transaction has been confirmed, you will be promptly notified, and your ${plan} plan will be seamlessly activated.

Best regards,
${CHAT_BOT_NAME}`,

  bankPayDomain: (
    priceNGN,
    domain,
  ) => `Please remit ${priceNGN} NGN by clicking “Make Payment” below. Once the transaction has been confirmed, you will be promptly notified, and your ${domain} domain will be seamlessly activated.

Best regards,
${CHAT_BOT_NAME}`,

  showDepositCryptoInfoPlan: (priceCrypto, tickerView, address, plan) =>
    `Please remit ${priceCrypto} ${tickerView} to\n\n<code>${address}</code>

Please note, crypto transactions can take up to 30 minutes to complete. Once the transaction has been confirmed, you will be promptly notified, and your ${plan} plan will be seamlessly activated.

Best regards,
${CHAT_BOT_NAME}`,

  showDepositCryptoInfoDomain: (priceCrypto, tickerView, address, domain) =>
    `Please remit ${priceCrypto} ${tickerView} to\n\n<code>${address}</code>

Please note, crypto transactions can take up to 30 minutes to complete. Once the transaction has been confirmed, you will be promptly notified, and your ${domain} domain will be seamlessly activated.

Best regards,
${CHAT_BOT_NAME}`,

  showDepositCryptoInfo: (priceCrypto, tickerView, address) =>
    `Please remit ${priceCrypto} ${tickerView} to\n\n<code>${address}</code>

Please note, crypto transactions can take up to 30 minutes to complete. Once the transaction has been confirmed, you will be promptly notified, and your wallet will be updated.

Best regards,
${CHAT_BOT_NAME}`,

  confirmationDepositMoney: (
    amount,
    usd,
  ) => `Your payment of ${amount} ($${usd}) is processed. Thank you for choosing us.
Best,
${CHAT_BOT_NAME}`,

  showWallet: (usd, ngn) => `Wallet Balance:

${bal(usd, ngn)}`,

  wallet: (usd, ngn) => `Wallet Balance:

${bal(usd, ngn)}

Select wallet option:`,

  walletSelectCurrency: (usd, ngn) => `Please select currency to pay from your Wallet Balance:

${bal(usd, ngn)}`,

  walletBalanceLow: `Please top up your wallet to continue`,

  sentLessMoney: (expected, got) =>
    `You sent less money than expected so we credited amount received into your wallet. We expected ${expected} but received ${got}`,
  sentMoreMoney: (expected, got) =>
    `You sent more money than expected so we credited the extra amount into your wallet. We expected ${expected} but received ${got}`,

  buyLeadsError: 'Unfortunately the selected area code is unavailable and your wallet has not been charged',
  buyLeadsProgress: (i, total) => `${((i * 100) / total).toFixed()}% leads downloaded. Please wait.`,

  phoneNumberLeads: 'Please select an option',

  buyLeadsSelectCountry: 'Please select country',
  buyLeadsSelectSmsVoice: 'Please select SMS / Voice',
  buyLeadsSelectArea: 'Please select area',
  buyLeadsSelectAreaCode: 'Please select area code',
  buyLeadsSelectCarrier: 'Please select carrier',
  buyLeadsSelectCnam: 'You want to search the owners name? CNAME costs extra 15$ per 1000 leads',
  buyLeadsSelectAmount: (min, max) =>
    `How much leads do you want to purchase? Select or type a number. Minimum is ${min} and Maximum is ${max}`,
  buyLeadsSelectFormat: 'Choose format i.e Local (212) or International (+1212)',
  buyLeadsSuccess: n => `Congrats your ${n} leads are downloaded.`,

  buyLeadsNewPrice: (leads, price, newPrice) => `Price of ${leads} leads is now $${view(newPrice)} <s>($${price})</s>`,
  buyLeadsPrice: (leads, price) => `Price of ${leads} leads is $${price}.`,

  confirmNgn: (usd, ngn) => `${usd} USD ≈ ${ngn} NGN `,
  walletSelectCurrencyConfirm: `Confirm?`,

  // Phone Number validator
  validatorSelectCountry: 'Please select country',
  validatorPhoneNumber: 'Please paste your numbers or upload a file including the country code.',
  validatorSelectSmsVoice: n =>
    `${n} phone numbers found. Please choose the option for SMS or voice call leads validation.`,
  validatorSelectCarrier: 'Please select carrier',
  validatorSelectCnam: 'You want to search the owners name? CNAME costs extra 15$ per 1000 leads',
  validatorSelectAmount: (min, max) =>
    `How much from the numbers you want to validate? Select or type a number. Minimum is ${min} and Maximum is ${max}`,
  validatorSelectFormat: 'Choose format i.e Local (212) or International (+1212)',

  validatorSuccess: (n, m) => `${n} leads are validated. ${m} valid phone numbers found.`,
  validatorProgress: (i, total) => `${((i * 100) / total).toFixed()}% leads validate. Please wait.`,
  validatorProgressFull: (i, total) => `${((i * 100) / total).toFixed()}% leads validate.`,

  validatorError: `Unfortunately the selected phone numbers are unavailable and your wallet has not been charged`,
  validatorErrorFileData: `Invalid country phone # found. Please upload phone number for selected country`,
  validatorErrorNoPhonesFound: `No phone numbers found. Try again.`,

  validatorBulkNumbersStart: 'Leads validation has started and will complete soon.',

  // url re-director
  redSelectUrl: 'Kindly share the URL that you would like shortened and analyzed. e.g https://cnn.com',
  redSelectRandomCustom: 'Please select your choice for random or custom link',
  redSelectProvider: 'Choose link provider',
  redSelectCustomExt: 'Enter custom back half',

  redValidUrl: 'Please provide a valid URL. e.g https://google.com',
  redTakeUrl: url => `Your shortened URL is: ${url}`,
  redIssueUrlBitly: `Some issue, your wallet is not charged.`,
  redIssueSlugCuttly: `The preferred link name is already taken, try another.`,
  redIssueUrlCuttly: `Some issue`,
  redNewPrice: (price, newPrice) => `Price is now $${view(newPrice)} <s>($${price})</s> Please choose payment method.`,
  customLink: 'Custom Link',
  randomLink: 'Random Link',
  askShortLinkExtension: 'Please tell your us preferred short link extension: e.g payer',
  linkAlreadyExist: `Link already exists. Please type 'ok' to try another.`,
  yourShortendUrl: shortUrl => `Your shortened URL is: ${shortUrl}`,

  availablefreeDomain: (plan, available, s) =>
    ` Remember, your ${plan} plan includes ${available} free ".sbs" domain${s}. Let's get your domain today!`,
  shortenedUrlLink: `Kindly share the URL that you would like shortened and analyzed. e.g https://cnn.com`,
  selectedTrialPlan: 'Your have selected Free Trial Plan',
  userPressedBtn: message => `User has Pressed ${message} Button.`,
  userToBlock: userToBlock => `User ${userToBlock} not found`,
  userBlocked: userToBlock => `User ${userToBlock} has been blocked.`,
  checkingDomainAvail: `Checking domain availability...`,
  checkingExistingDomainAvail: `Checking existing domain availability...`,
  subscribeFirst: `📋 Subscribe first`,
  notValidHalf: `Enter a valid back half`,
  linkAlreadyExist: `Link already exists. Please try another.`,
  issueGettingPrice: 'Some issue in getting price',
  domainInvalid: 'Domain name is invalid. Please try another domain name. Use format abcpay.com',
  chooseValidPlan: 'Please choose a valid plan',
  noDomainFound: 'No domain names found',
  chooseValidDomain: 'Please choose a valid domain',
  errorDeletingDns: error => `Error deleting dns record, ${error}, Provide value again`,
  selectValidOption: 'select valid option',
  maxDnsRecord: 'Maximum 4 NS records can be added, you can update or delete previous NS records',
  errorSavingDns: error => `Error saving dns record, ${error}, Provide value again`,
  fileError: 'Error occurred while processing the file.',
  ammountIncorrect: 'Amount incorrect',
  subscriptionExpire: (subscribedPlan, timeEnd) => `Your ${subscribedPlan} subscription is expired on ${timeEnd}`,
  plansSubscripedtill: (subscribedPlan, timeEnd) =>
    `You are currently subscribed to the ${subscribedPlan} plan. Your plan is valid till ${timeEnd}`,
  planNotSubscriped: 'You are not currently subscribed to any plan.',
  noShortenedUrlLink: 'You have no shortened links yet.',
  shortenedLinkText: linksText => `Here are your shortened links:\n${linksText}`,

  //////////
  qrCodeText:'Here is your QR code!',
  scanQrOrUseChat: (chatId) => `Scan QR with sms marketing app to login. You can also use this code to login: ${chatId}`,
  domainPurchasedFailed: (domain, buyDomainError) => `Domain purchase fails, try another name. ${domain} ${buyDomainError}`
}

const phoneNumberLeads = ['💰📲 Buy PhoneLeads', '✅📲 Validate PhoneLeads']

const buyLeadsSelectCountry = Object.keys(areasOfCountry)
const buyLeadsSelectSmsVoice = ['SMS (Price 20$ for 1000)', 'Voice (Price 0$ for 1000)']
const buyLeadsSelectArea = country => Object.keys(areasOfCountry?.[country])
const buyLeadsSelectAreaCode = (country, area) => {
  const codes = areasOfCountry?.[country]?.[area].map(c => format(countryCodeOf[country], c))
  return codes.length > 1 ? ['Mixed Area Codes'].concat(codes) : codes
}
const _buyLeadsSelectAreaCode = (country, area) => areasOfCountry?.[country]?.[area]
const buyLeadsSelectCnam = yesNo
const buyLeadsSelectCarrier = country => carriersOf[country]
const buyLeadsSelectAmount = ['1000', '2000', '3000', '4000', '5000']
const buyLeadsSelectFormat = ['Local Format', 'International Format']

const validatorSelectCountry = Object.keys(areasOfCountry)
const validatorSelectSmsVoice = ['SMS (Price 15$ for 1000)', 'Voice (Price 0$ for 1000)']
const validatorSelectCarrier = country => carriersOf[country]
const validatorSelectCnam = yesNo
const validatorSelectAmount = ['ALL', '1000', '2000', '3000', '4000', '5000']
const validatorSelectFormat = ['Local Format', 'International Format']

//redSelectRandomCustom

const redSelectRandomCustom = ['Random Short Link']

const redSelectProvider = ['Bit.ly $10 (No trial)', 'Ap1s.net (Sub Required After Trial)']

const tickerOf = {
  BTC: 'btc',
  LTC: 'ltc',
  ETH: 'eth',
  'USDT (TRC20)': 'trc20_usdt',
  BCH: 'bch',
  'USDT (ERC20)': 'erc20_usdt',
  DOGE: 'doge',
  TRON: 'trx',
  // Matic: 'polygon_matic',
}

const supportedCrypto = {
  BTC: '₿ Bitcoin (BTC)',
  LTC: 'Ł Litecoin (LTC)',
  DOGE: 'Ð Dogecoin (DOGE)',
  BCH: 'Ƀ Bitcoin Cash (BCH)',
  ETH: 'Ξ Ethereum (ETH)',
  TRON: '🌐 Tron (TRX)',
  'USDT (TRC20)': '₮ Tether (USDT - TRC20)',
  'USDT (ERC20)': '₮ Tether (USDT - ERC20)',
}

/////////////////////////////////////////////////////////////////////////////////////
const _bc = ['Back', 'Cancel']

const payIn = {
  crypto: 'Crypto',
  ...(HIDE_BANK_PAYMENT !== 'true' && { bank: 'Bank ₦aira + Card🏦💳' }),
  wallet: '👛 Wallet',
}

const tickerViews = Object.keys(tickerOf)
const reverseObject = o => Object.fromEntries(Object.entries(o).map(([key, val]) => [val, key]))
const tickerViewOf = reverseObject(tickerOf)
const supportedCryptoView = reverseObject(supportedCrypto)
const supportedCryptoViewOf = Object.keys(supportedCryptoView)

const kOf = list => ({
  reply_markup: {
    // Handle if there are multiples buttons in a row
    keyboard: [
      ...list.map(a => (Array.isArray(a) ? a : [a])),
      ...(list.some(
        a =>
          Array.isArray(a) &&
          a.some(
            item =>
              typeof item === 'string' &&
              (item.includes(t.backButton) ||
                item.includes(user.backToHostingPlans) ||
                item.includes(user.backToStarterPlanDetails) ||
                item.includes(user.backToPurchaseOptions)),
          ),
      )
        ? []
        : [_bc]),
    ],
  },
  parse_mode: 'HTML',
})
const yes_no = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [yesNo, _bc],
  },
  disable_web_page_preview: true,
}
const k = {
  of: kOf,

  wallet: {
    reply_markup: {
      keyboard: [[u.deposit], [u.withdraw], _bc],
    },
  },

  pay: {
    reply_markup: {
      keyboard: [Object.values(payIn), _bc],
    },
    parse_mode: 'HTML',
  },

  phoneNumberLeads: kOf(phoneNumberLeads),
  buyLeadsSelectCountry: kOf(buyLeadsSelectCountry),
  buyLeadsSelectSmsVoice: kOf(buyLeadsSelectSmsVoice),
  buyLeadsSelectArea: country => kOf(buyLeadsSelectArea(country)),
  buyLeadsSelectAreaCode: (country, area) => kOf(buyLeadsSelectAreaCode(country, area)),
  buyLeadsSelectCarrier: country => kOf(buyLeadsSelectCarrier(country)),
  buyLeadsSelectCnam: kOf(yesNo),
  buyLeadsSelectAmount: kOf(buyLeadsSelectAmount),
  buyLeadsSelectFormat: kOf(buyLeadsSelectFormat),
  // changing here for validatorSelectCountry
  validatorSelectCountry: kOf(validatorSelectCountry),
  validatorSelectSmsVoice: kOf(validatorSelectSmsVoice),
  validatorSelectCarrier: country => kOf(validatorSelectCarrier(country)),
  validatorSelectCnam: kOf(validatorSelectCnam),
  validatorSelectAmount: kOf(validatorSelectAmount),
  validatorSelectFormat: kOf(validatorSelectFormat),

  //url shortening
  redSelectRandomCustom: kOf(redSelectRandomCustom),

  redSelectProvider: kOf(redSelectProvider),
}
const payOpts = HIDE_BANK_PAYMENT !== 'true' ? k.of([u.usd, u.ngn]) : k.of([u.usd])

const adminKeyboard = {
  reply_markup: {
    keyboard: Object.values(admin).map(b => [b]),
  },
}

const userKeyboard = {
  reply_markup: {
    keyboard: [
      [user.cPanelWebHostingPlans],
      [user.pleskWebHostingPlans],
      [user.joinChannel, user.wallet],
      [user.phoneNumberLeads],
      HIDE_SMS_APP === 'true' ? [user.domainNames] : [user.freeTrialAvailable, user.domainNames],
      [user.urlShortenerMain],
      [user.buyPlan, user.viewPlan],
      HIDE_BECOME_RESELLER === 'true'
        ? [user.changeSetting, user.getSupport]
        : [user.changeSetting, user.becomeReseller, user.getSupport],
    ],
  },
  parse_mode: 'HTML',
  disable_web_page_preview: true,
}

const languages = {
  en: '🇬🇧 English',
  fr: '🇫🇷 French',
  zh: '🇨🇳 Chinese',
  hi: '🇮🇳 Hindi',
}
const supportedLanguages = reverseObject(languages)

const languageMenu = {
  reply_markup: {
    keyboard: [[languages.en], [languages.fr], [languages.zh], [languages.hi]],
  },
  parse_mode: 'HTML',
  disable_web_page_preview: true,
}

const l = {
  askPreferredLanguage: `🌍 To ensure everything is in your preferred language, please select one below:
  
You can always change your language later in the settings.`,
  askValidLanguage: 'Please choose a valid language:',
  welcomeMessage: `👋 Welcome to ${CHAT_BOT_NAME}!
We’re thrilled to have you here! 🎉
Let’s get you started so you can explore all the exciting features we offer. 🌟

This setup is quick and easy—let's dive in! 🚀`,
  askUserEmail: 'What’s your email ? Let’s personalize your experience! (e.g., davidsen@gmail.com)',
  processUserEmail: ` Thank you 😊 We’re setting up your account now.
Please hold on for just a moment while we finalize the details. ⏳
 
We’re doing the work behind the scenes. Just follow the steps!`,
  confirmUserEmail: `✨ Great news! Your account is ready! 🎉💃🎉

Enjoy premium features during your free trial period!
`,
  termsAndCond: `📜 Before proceeding, please review and accept our Terms and Conditions.`,
  acceptTermMsg: `Please accept the Terms and Conditions to continue using ${CHAT_BOT_NAME}`,

  acceptTermButton: '✅ Accept',
  declineTermButton: '❌ Decline',
  viewTermsAgainButton: '🔄 View Terms Again',
  exitSetupButton: '❌ Exit Setup',
  acceptedTermsMsg: `✅ You’ve successfully accepted the Terms and Conditions! 🎉
You’re all set to begin using ${CHAT_BOT_NAME}. Let’s move to the fun part! 🎯

You can revisit the Terms and Conditions anytime in your profile settings`,
  declinedTermsMsg: `⚠️ You need to accept the Terms and Conditions to continue using ${CHAT_BOT_NAME}. 
Please review them again when you’re ready.`,
  userExitMsg: 'User has pressed exit button.',
  termsAndCondMsg: `<h1>Terms and Conditions for ${CHAT_BOT_NAME}</h1>
        <p><strong>Effective Date:</strong> 01/01/2022</p>
        <p>By using ${CHAT_BOT_NAME}, you agree to these Terms and Conditions.</p>

        <h2>1. Acceptance of Terms</h2>
        <p>You must be 18+ or have guardian consent and agree to these terms and our Privacy Policy.</p>

        <h2>2. Services Provided</h2>
        <p>We offer domain registration, web hosting, and site/app setup support.</p>

        <h2>3. User Responsibilities</h2>
        <p>Provide accurate information, avoid illegal activities, and secure your Telegram account.</p>

        <h2>4. Payment Terms</h2>
        <p>All payments are final unless otherwise stated. Non-payment may lead to service suspension.</p>

        <h2>5. Service Limitations</h2>
        <p>We may impose resource limits or experience downtime due to maintenance or technical issues.</p>

        <h2>6. Termination</h2>
        <p>We can terminate services for violations or non-payment. Users can cancel anytime, but fees are non-refundable.</p>

        <h2>7. Liability</h2>
        <p>Services are “as is.” We’re not liable for data loss, outages, or user security breaches.</p>

        <h2>8. Privacy</h2>
        <p>We handle your data per our Privacy Policy and only share it as legally required.</p>

        <h2>9. Changes to Terms</h2>
        <p>We may update these terms, and continued use implies acceptance.</p>

        <h2>10. Contact</h2>
        <p>For support, reach us at <a href="${APP_SUPPORT_LINK}" target="_blank">${APP_SUPPORT_LINK}</a>.</p>

        <p>By using ${CHAT_BOT_NAME}, you agree to these terms. Thank you!</p>`,
}

const termsAndConditionType = lang => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'View Terms And Condition',
          web_app: {
            url: `${SELF_URL}/terms-condition?lang=${lang}`,
          },
        },
      ],
    ],
  },
})

const planOptions = ['Daily', 'Weekly', 'Monthly']
const planOptionsOf = {
  Daily: 'Daily',
  Weekly: 'Weekly',
  Monthly: 'Monthly',
}

const linkOptions = [t.randomLink, t.customLink]

const chooseSubscription = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [...planOptions.map(a => [a]), _bc],
  },
}

const dO = {
  reply_markup: {
    keyboard: [_bc, ['Backup Data'], ['Restore Data']],
  },
}

const bc = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [_bc],
  },
  disable_web_page_preview: true,
}

const dns = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [[t.addDns], [t.updateDns], [t.deleteDns], _bc],
  },
  disable_web_page_preview: true,
}
const dnsRecordType = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [[t.cname], [t.ns], [t.a], _bc],
  },
  disable_web_page_preview: true,
}

const linkType = {
  reply_markup: {
    keyboard: [linkOptions, _bc],
  },
}

const show = domains => ({
  reply_markup: {
    keyboard: [[user.buyDomainName], ...domains.map(d => [d]), _bc],
  },
})

const payBank = url => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Make Payment',
          web_app: {
            url,
          },
        },
      ],
    ],
  },
})

const html = (text = t.successPayment) => {
  return `
        <html>
            <body>
                <p style="font-family: 'system-ui';" >${text}</p>
            </body>
        </html>
    `
}
const plans = hostingType => {
  return {
    starterPlan: {
      name: 'Starter Plan',
      price: HOSTING_STARTER_PLAN_PRICE,
      duration: '30 days',
      storage: '10 GB SSD',
      bandwidth: '100 GB',
      domains: '1 domain',
      emailAccounts: '5 email accounts',
      databases: '1 MySQL database',
      features: `Full access to ${hostingType} for managing files, databases, emails, etc.`,
      idealFor: 'Personal blogs, small business websites, or portfolios.',
    },
    proPlan: {
      name: 'Pro Plan',
      price: HOSTING_PRO_PLAN_PRICE,
      duration: '30 days',
      storage: '50 GB SSD',
      bandwidth: '500 GB',
      domains: '5 domains',
      emailAccounts: '25 email accounts',
      databases: '10 MySQL databases',
      features: `Full access to ${hostingType} with advanced tools for backups, security, and analytics.`,
      additionalFeatures: 'Free website migration, daily backups.',
      idealFor: 'Small to medium-sized business websites, e-commerce sites.',
    },
    businessPlan: {
      name: 'Business Plan',
      price: HOSTING_BUSINESS_PLAN_PRICE,
      duration: '30 days',
      storage: '100 GB SSD',
      bandwidth: 'Unlimited',
      domains: 'Unlimited domains',
      emailAccounts: 'Unlimited email accounts',
      databases: 'Unlimited MySQL databases',
      features: `Full access to ${hostingType} with all advanced features, including priority support.`,
      additionalFeatures: 'Free website migration, daily backups, staging environment, enhanced security features.',
      idealFor: 'Large businesses, high-traffic websites, and developers needing more flexibility.',
    },
  }
}
const hostingPlansText = {
  plans: plans,
  generatePlanText: (hostingType, planKey) => {
    const plan = plans(hostingType)[planKey]
    return `
  🚀 <b>${plan.name}: $${plan.price}</b>
  
  <b>- Duration:</b> ${plan.duration}
  <b>- Storage:</b> ${plan.storage}
  <b>- Bandwidth:</b> ${plan.bandwidth}
  <b>- Domains:</b> ${plan.domains}
  <b>- Email Accounts:</b> ${plan.emailAccounts}
  <b>- Databases:</b> ${plan.databases}
  <b>- Free SSL:</b> Yes
  <b>- ${hostingType} Features:</b> ${plan.features}
  ${plan.additionalFeatures ? `<b>- Additional Features:</b> ${plan.additionalFeatures}` : ''}
  <b>- Ideal for:</b> ${plan.idealFor}`
  },
  generatePlanStepText: step => {
    const commonSteps = {
      buyText: 'Great choice! Do you need a new domain or want to use an existing one?',
      registerNewDomainText: 'Please enter the domain name you want to register (e.g., example.com).',
      domainNotFound:
        'The domain you entered could not be found. Please ensure the right domain or try using a different one.',
      useExistingDomainText: 'Please enter your existing domain name (e.g., example.com).',
      useExistingDomainNotFound:
        'The domain you entered is not associated with your account. Please ensure you are using the correct domain or contact support for assistance.',
      enterYourEmail: 'Please provide your email address to create your account and send your receipt.',
      invalidEmail: 'Please provide a valid email',
      paymentConfirmation: 'Please confirm the transaction to proceed with your purchase.',
      paymentSuccess: `We are verifying your payment. You will be promptly notified as soon as it is confirmed. Thank you for choosing us!`,
      paymentFailed: 'Payment failed. Please try again.',
    }

    return `${commonSteps[step]}`
  },
  generateDomainFoundText: (websiteName, price) => `The domain ${websiteName} is available!. The cost is $${price}.`,
  generateExistingDomainText: websiteName => `You have selected ${websiteName} as your domain.`,
  domainNotFound: websiteName => `The domain ${websiteName} is not available.`,
  nameserverSelectionText: websiteName =>
    `Please select the nameserver provider you would like to use for ${websiteName}.`,
  confirmEmailBeforeProceeding: email => `Are you sure you want to proceed with this ${email} email?`,

  generateInvoiceText: payload => `
<b>Domain Registration</b>
<b>- Domain: </b> ${payload.domainName}
<b>- Price: </b> $${payload?.existingDomain ? '0 (using existing domain)' : payload.domainPrice}
  
<b>Web Hosting</b>
<b>- Duration: </b> 1 Month
<b>- Price: </b> $${payload.hostingPrice}
  
<b>Total Amount Due:</b>
<b>- Coupon Discount: </b> $${payload.couponDiscount}
<b>- USD: </b> $${payload?.couponApplied ? payload.newPrice : payload.totalPrice}
<b>- Tax: </b> $0.00
  
<b>Payment Terms</b>
This is a prepayment invoice. Please ensure payment is completed within 1 hr to activate your domain and hosting services. Once payment is received, we will proceed with the activation of your service.
  `,

  showCryptoPaymentInfo: (priceCrypto, tickerView, address, plan) => `
Please remit ${priceCrypto} ${tickerView} to
  
<code>${address}</code>
  
Please note, crypto transactions can take up to 30 minutes to complete. Once the transaction has been confirmed, you will be promptly notified, and your ${plan} will be seamlessly activated.
  
Best regards,
${CHAT_BOT_NAME}`,

  successText: (info, response) =>
    `Here are your ${info.hostingType} Credentials for ${info.plan}:
  
Domain: ${info.website_name}
Username: ${response.username}
Email: ${info.email}
Password: ${response.password}
URL: ${response.url}
  
<b>Nameservers</b>
  - ${response.nameservers.ns1}
  - ${response.nameservers.ns2}
    
Your ${info.hostingType} credentials has been successfully sent to your email ${info.email} as well`,

  support: (plan, statusCode) => `Something went wrong while setting up your ${plan}|${statusCode}. 
                                                Please contact support ${SUPPORT_USERNAME}.
                                                Discover more ${TG_HANDLE}.`,

  bankPayDomain: (
    priceNGN,
    plan,
  ) => `Please remit ${priceNGN} NGN by clicking “Make Payment” below. Once the transaction has been confirmed, you will be promptly notified, and your ${plan} will be seamlessly activated.
  
  Best regards,
  ${CHAT_BOT_NAME}`,
}

const en = {
  k,
  t,
  u,
  dO,
  bc,
  npl,
  dns,
  kOf,
  user,
  show,
  yesNo,
  html,
  payIn,
  admin,
  payOpts,
  yes_no,
  payBank,
  alcazar,
  tickerOf,
  linkType,
  tickerViews,
  linkOptions,
  planOptions,
  tickerViewOf,
  dnsRecordType,
  o: userKeyboard,
  phoneNumberLeads,
  aO: adminKeyboard,
  chooseSubscription,
  buyLeadsSelectArea,
  buyLeadsSelectCnam,
  buyLeadsSelectAmount,
  buyLeadsSelectFormat,
  buyLeadsSelectCountry,
  buyLeadsSelectCarrier,
  buyLeadsSelectSmsVoice,
  buyLeadsSelectAreaCode,
  _buyLeadsSelectAreaCode,
  validatorSelectCountry,
  validatorSelectSmsVoice,
  validatorSelectCarrier,
  validatorSelectCnam,
  validatorSelectAmount,
  validatorSelectFormat,
  redSelectRandomCustom,
  redSelectProvider,
  supportedCrypto,
  supportedCryptoView,
  supportedCryptoViewOf,
  languageMenu,
  supportedLanguages,
  l,
  termsAndConditionType,
  planOptionsOf,
  hP: hostingPlansText,
}

module.exports = {
  en,
}
