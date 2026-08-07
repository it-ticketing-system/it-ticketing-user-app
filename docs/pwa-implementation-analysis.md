# تحلیل نهایی PWA برای user-app

تاریخ بازبینی: 2026-08-03

دامنه بازبینی: `src/app/(pwa)`, `src/app/(auth)`, layoutها، providerها، hookهای
request، سرویس های API، React Query setup، auth flow، فایل های `public`، i18n،
`next.config.ts`، Tailwind CSS 4، HeroUI 3، و اسناد `docs/API-Design.txt` و
`docs/design system spec.txt`.

## 1. خلاصه اجرایی

پروژه از نظر معماری برای PWA شدن آماده است، اما در وضعیت فعلی هنوز PWA واقعی
نیست. بخش `/app` shell اختصاصی دارد، route entrypointها نازک هستند، داده ها از
`/api/backend/*` عبور می کنند، auth با cookie امن `httpOnly` انجام می شود، و
React Query یک نقطه مشترک برای fetch state دارد. اینها پایه خوبی برای
installability، offline shell، persistence خواندنی و update lifecycle هستند.

در عوض، هیچ `manifest.ts`، service worker، offline page، install prompt سفارشی،
network state، update UI، IndexedDB persistence یا push subscription وجود ندارد.
routeهای auth هم فعلا زیر `/login` و `/register` هستند و بیرون از scope قطعی PWA
قرار می گیرند.

تصمیم نهایی این گزارش این است که کل تجربه user-app زیر URL واقعی `/app` قرار
بگیرد. login/register به `/app/login` و `/app/register` منتقل می شوند، offline
page در `/app/offline` می آید، و صفحات محافظت شده زیر route group جداگانه
`(protected)` می روند. PWA به صورت progressive enhancement پیاده می شود: اگر
مرورگر API لازم را داشت قابلیت فعال می شود، اگر نداشت اپ مانند نسخه آنلاین فعلی
کار می کند و نباید crash کند.

محدوده offline فقط مشاهده آخرین داده موفق ذخیره شده است. هیچ offline mutation،
draft آفلاین، Background Sync، queue ارسال تیکت/پیام یا ذخیره attachment Blob
برای sync آفلاین در نقشه پیاده سازی وجود ندارد.

## 2. وضعیت فعلی repository

نسخه های واقعی نصب شده در `package.json`:

| ابزار                | نسخه فعلی                                      |
| -------------------- | ---------------------------------------------- |
| Next.js              | `16.2.10`                                      |
| React                | `19.2.4`                                       |
| Tailwind CSS         | `4.x` با `@tailwindcss/postcss`                |
| HeroUI               | `@heroui/react@3.2.2` و `@heroui/styles@3.2.2` |
| TanStack React Query | `5.101.4`                                      |
| next-intl            | `4.13.2`                                       |
| axios                | `1.18.1`                                       |

تنظیمات فعلی:

- `next.config.ts` فقط `next-intl/plugin` را wrap می کند و گزینه PWA/cache خاصی
  ندارد.
- `src/app/layout.tsx` فونت های `Geist` و `Vazirmatn`، `lang="fa"`, `dir="rtl"`,
  `data-theme="light"` و `AppProviders` را mount می کند.
- `src/app/globals.css` از Tailwind CSS 4 و `@heroui/styles` استفاده می کند و
  `tokens.css`, `heroui-theme.css`, `heroui-components.css` را import می کند.
- Tailwind config جداگانه در repo دیده نمی شود؛ tokenها با `@theme` داخل CSS
  تعریف شده اند.
- `src/providers/app-providers.tsx` شامل `IntlProvider`, `ReactQueryProvider`,
  `LucideProvider` و `Toast.Provider` از HeroUI است.
- `src/providers/react-query-provider.tsx` یک `QueryClient` in-memory می سازد.
  `retry` برای query/mutation خاموش است و `refetchOnWindowFocus` خاموش است.
- persistence، hydration/dehydration یا persister برای React Query وجود ندارد.

routeهای فعلی:

| مسیر فایل فعلی                                   | URL فعلی                               | وضعیت                                                           |
| ------------------------------------------------ | -------------------------------------- | --------------------------------------------------------------- |
| `src/app/(website)/page.tsx`                     | `/`                                    | صفحه marketing                                                  |
| `src/app/(auth)/login/page.tsx`                  | `/login`                               | باید به `/app/login` منتقل شود                                  |
| `src/app/(auth)/register/page.tsx`               | `/register`                            | باید به `/app/register` منتقل شود                               |
| `src/app/(pwa)/layout.tsx`                       | wrapper فعلی همه routeهای داخل `(pwa)` | فعلا `AuthProvider + PWALayout` را روی کل `/app/*` اعمال می کند |
| `src/app/(pwa)/app/tickets/page.tsx`             | `/app/tickets`                         | protected                                                       |
| `src/app/(pwa)/app/tickets/create/page.tsx`      | `/app/tickets/create`                  | protected                                                       |
| `src/app/(pwa)/app/tickets/[ticket-id]/page.tsx` | `/app/tickets/[ticket-id]`             | protected                                                       |
| `src/app/(pwa)/app/notifications/page.tsx`       | `/app/notifications`                   | protected                                                       |
| `src/app/(pwa)/app/profile/page.tsx`             | `/app/profile`                         | protected                                                       |

API proxy فعلی:

- `src/app/api/backend/[...path]/route.ts` همه متدهای `GET`, `POST`, `PUT`,
  `PATCH`, `DELETE` را به `API_BASE_URL` proxy می کند.
- proxy روی همه fetchها `cache: 'no-store'` دارد.
- اگر backend پاسخ 401 بدهد، cookie `access_token` حذف می شود.
- `src/app/api/backend/auth/login/route.ts` login را جداگانه انجام می دهد، token
  را در cookie `httpOnly` ذخیره می کند، و token را به browser برنمی گرداند.
- `src/app/api/backend/auth/logout/route.ts` logout backend را best effort انجام
  می دهد و در `finally` cookie را حذف می کند.

فایل های public فعلی:

- `public/logo/logo-mark-primary-512.png`
- تصاویر marketing و auth در `public/hero` و `public/auth`
- هیچ `sw.js`، پوشه `public/icons`، icon 192، maskable icon یا apple touch icon
  وجود ندارد.

## 3. مشکلات و شکاف های فعلی PWA

- `src/app/manifest.ts` وجود ندارد؛ app installable نیست.
- service worker وجود ندارد؛ offline navigation و update lifecycle نداریم.
- `/app/offline` وجود ندارد.
- auth هنوز خارج از `/app` است و با `scope: "/app"` داخل PWA قرار نمی گیرد.
- layout فعلی `(pwa)` کل `/app` را مجبور به `AuthProvider` و `PWALayout` می کند؛
  برای `/app/login`, `/app/register`, `/app/offline` مناسب نیست.
- React Query cache فقط in-memory است و با reload یا app relaunch از بین می رود.
- هیچ user-scoped IndexedDB persistence وجود ندارد.
- offline/online state در UI وجود ندارد.
- write actionها هنگام offline تشخیص داده و disable نمی شوند.
- `clientApiClient` هنگام 401 به `ROUTES.login` می رود که فعلا `/login` است؛ بعد
  از migration باید `/app/login` شود.
- push notification فقط در سطح in-app notification list/read وجود دارد؛ Web Push
  subscription و VAPID در frontend/backend موجود نیست.
- `public/logo/logo-mark-primary-512.png` برای icon معمولی 512 می تواند پایه
  باشد، اما برای maskable کافی نیست و icon 192 هم کم است.

## 4. معماری route جدید

ساختار هدف:

```text
src/app/
├── layout.tsx
├── manifest.ts
├── api/
└── (pwa)/
    └── app/
        ├── layout.tsx
        ├── offline/
        │   └── page.tsx
        ├── (auth)/
        │   ├── layout.tsx
        │   ├── login/
        │   │   └── page.tsx
        │   └── register/
        │       └── page.tsx
        └── (protected)/
            ├── layout.tsx
            ├── tickets/
            ├── notifications/
            └── profile/
```

URLهای نهایی:

| فایل هدف                                                     | URL نهایی                  |
| ------------------------------------------------------------ | -------------------------- |
| `src/app/(pwa)/app/(auth)/login/page.tsx`                    | `/app/login`               |
| `src/app/(pwa)/app/(auth)/register/page.tsx`                 | `/app/register`            |
| `src/app/(pwa)/app/(protected)/tickets/page.tsx`             | `/app/tickets`             |
| `src/app/(pwa)/app/(protected)/tickets/create/page.tsx`      | `/app/tickets/create`      |
| `src/app/(pwa)/app/(protected)/tickets/[ticket-id]/page.tsx` | `/app/tickets/[ticket-id]` |
| `src/app/(pwa)/app/(protected)/notifications/page.tsx`       | `/app/notifications`       |
| `src/app/(pwa)/app/(protected)/profile/page.tsx`             | `/app/profile`             |
| `src/app/(pwa)/app/offline/page.tsx`                         | `/app/offline`             |

Route groupها وارد URL نمی شوند. segment واقعی `app` باید حفظ شود، چون scope
نهایی manifest برابر `/app` است.

ملاحظات conflict:

- مسیرهای فعلی `src/app/(pwa)/app/tickets`, `notifications`, `profile` و مسیرهای
  هدف زیر `(protected)` به URL یکسان resolve می شوند. در زمان پیاده سازی نباید
  هر دو ساختار هم زمان باقی بمانند؛ باید فایل ها move شوند، نه copy.
- مسیرهای فعلی `src/app/(auth)/login` و مسیرهای جدید
  `src/app/(pwa)/app/(auth)/login` URL متفاوت دارند (`/login` در برابر
  `/app/login`) و conflict ندارند، اما پس از migration باید مسیرهای قدیمی حذف یا
  به redirect موقت تبدیل شوند.
- اگر redirectهای موقت برای `/login` و `/register` لازم باشد، باید routeهای
  قدیمی دیگر UI اصلی را render نکنند و فقط redirect کنند.

## 5. مسئولیت layoutها و providerها

### `src/app/layout.tsx`

وضعیت فعلی با هدف سازگار است و باید global بماند:

- HTML `lang="fa"` و `dir="rtl"`
- light theme با `className="light"` و `data-theme="light"`
- فونت های `Geist` و `Vazirmatn`
- `AppProviders`
- metadata عمومی از `messages/fa/mainLayout.json`

این فایل نباید service worker registration یا auth guard route-specific بگیرد،
مگر provider واقعا global باشد. برای این پروژه بهتر است provider سطح PWA زیر
`/app` mount شود.

### `src/app/(pwa)/app/layout.tsx`

این فایل جدید باید کل محدوده `/app` را پوشش دهد، اما نباید کاربر را مجبور به
authentication کند. مسئولیت پیشنهادی:

- mount کردن provider سطح بالای PWA.
- capture کردن `beforeinstallprompt` حتی در `/app/login`.
- ثبت service worker در production.
- نگهداری network state.
- نگهداری service worker update state.
- standalone detection.
- feature detection مربوط به push، بدون درخواست permission.

فایل پیشنهادی provider: `src/providers/pwa-provider.tsx` به عنوان یک provider
سطح بالا و محدود به `/app`. این فایل جدید است؛ الان در repo وجود ندارد.

### `src/app/(pwa)/app/(auth)/layout.tsx`

این فایل برای guest pages است:

- `AuthLayout` فعلی را render کند.
- اگر cookie `access_token` وجود داشت، کاربر را به `ROUTES.tickets` یعنی
  `/app/tickets` redirect کند.
- `AppHeader`, `BottomNavigation` و `PWALayout` را render نکند.
- `AuthProvider` لازم ندارد، چون auth layout فعلی با `cookies()` کار می کند.

`src/layouts/auth/index.tsx` موجود است و می تواند reuse شود، اما باید اطمینان
پیدا کند redirect مقصد از `ROUTES.tickets` درست است.

### `src/app/(pwa)/app/(protected)/layout.tsx`

این فایل برای authenticated pages است:

- `AuthProvider` فعلی یا نسخه توسعه یافته آن را mount کند.
- guard سمت client/server برای redirect کاربر unauthenticated به `/app/login`
  داشته باشد.
- `PWALayout` فعلی را render کند.
- UIهای protected-only مثل install prompt، update available، network/offline
  indicator و در آینده push permission را داخل shell نشان دهد.

وضعیت فعلی `AuthProvider`: کاربر را با `QUERY_KEYS.auth.me` می گیرد، logout می
کند، query cache را پاک می کند، اما خودش به تنهایی route guard کامل نیست.
redirect 401 در `clientApiClient` انجام می شود و مقصد فعلی آن `/login` است. در
migration باید مقصد به `/app/login` تغییر کند و برای initial protected render هم
guard قابل اتکا اضافه شود تا کاربر unauthenticated داخل standalone از scope خارج
نشود.

## 6. Manifest

فایل هدف:

- `src/app/manifest.ts` جدید

این file convention رسمی App Router است. طبق مستندات نصب شده Next.js،
`manifest.ts` در root `app` یک special route handler است و تا وقتی request-time
API استفاده نکند cache/static می ماند.

تصمیم های قطعی manifest:

| field              | مقدار/منبع                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `start_url`        | `"/app/tickets"`                                                                                                      |
| `scope`            | `"/app"`                                                                                                              |
| `display`          | `"standalone"`                                                                                                        |
| `lang`             | `"fa"`                                                                                                                |
| `dir`              | `"rtl"`                                                                                                               |
| `orientation`      | `"portrait-primary"`                                                                                                  |
| `name`             | از `messages/fa/mainLayout.json`، مقدار برند فعلی: «سامانه تیکتینگ»                                                   |
| `short_name`       | باید از i18n/constant مرتبط با برند گرفته شود؛ اگر کلید جدید لازم شد در namespace PWA اضافه شود، نه hard-code پراکنده |
| `description`      | از `messages/fa/mainLayout.json`، description فعلی سامانه                                                             |
| `theme_color`      | هماهنگ با token accent/primary، پیشنهاد: `#2563eb` از `--color-primary-500`                                           |
| `background_color` | هماهنگ با background light، پیشنهاد: `#fafafa` از `--color-neutral-50`                                                |

shortcuts پیشنهادی:

| نام        | URL                   |
| ---------- | --------------------- |
| تیکت ها    | `/app/tickets`        |
| ایجاد تیکت | `/app/tickets/create` |
| اعلان ها   | `/app/notifications`  |
| پروفایل    | `/app/profile`        |

iconهای لازم:

- `public/icons/icon-192.png` جدید
- `public/icons/icon-512.png` جدید یا استفاده کنترل شده از
  `public/logo/logo-mark-primary-512.png` به عنوان منبع icon عادی 512
- `public/icons/maskable-512.png` جدید و مستقل
- `src/app/apple-icon.png` یا `public/icons/apple-touch-icon.png` با
  link/metadata مناسب در صورت نیاز

تحلیل asset موجود:

- `public/logo/logo-mark-primary-512.png` تنها asset مرتبط با logo و اندازه 512
  است.
- برای manifest icon عادی 512 می تواند مناسب باشد، اگر padding، پس زمینه و وضوح
  آن در install UI قابل قبول باشد.
- برای `192x192` کمبود asset داریم.
- برای maskable icon کافی نیست که فقط `purpose: "maskable"` روی لوگوی معمولی
  بگذاریم. maskable icon باید safe zone مناسب داشته باشد تا در شکل های adaptive
  سیستم عامل crop نشود.

## 7. Service Worker و caching strategy

فاز اول باید از service worker کوچک و دستی استفاده کند، چون در `package.json` و
lockfile ابزار نصب شده ای مثل Workbox، Serwist یا next-pwa دیده نمی شود. وابستگی
جدید در این مرحله نصب نمی شود. اگر بعدا scope پیچیده شد، migration به
Workbox/Serwist فقط پس از بررسی سازگاری با Next 16 قابل تصمیم گیری است.

فایل پیشنهادی:

- `public/sw.js` جدید

محدودیت های service worker دستی:

- Next assetهای hashدار `_next/static/*` نباید به صورت hard-coded فهرست شوند.
- precache کامل build بدون integration اختصاصی شکننده است.
- باید versioning، cleanup، navigation fallback و update lifecycle دستی نوشته
  شود.
- باید مراقب data leakage بین کاربران بود.

استراتژی caching:

### Navigationهای `/app/*`

- Network First.
- اگر network موفق بود، response navigation امن و قابل cache شدن برای shell/page
  ذخیره شود.
- اگر network شکست خورد و همان navigation قبلا cache شده بود، cached response
  برگردد.
- اگر network و cache هر دو نبودند، fallback به `/app/offline`.
- `/app/offline` باید از قبل cache شود و بدون API کار کند.

### Static assets عمومی

- assetهای عمومی و غیرحساس مثل logo/icon/auth/hero images می توانند Stale While
  Revalidate یا Cache First داشته باشند.
- فایل های `/_next/static/*` را با اتکا به request runtime و cache headers
  مدیریت کنیم، نه با لیست hard-coded.
- responseهای opaque/cross-origin غیرضروری cache نشوند.

### APIهای خصوصی

مسیرهای زیر نباید داخل Cache Storage عمومی ذخیره شوند:

- `/api/backend/auth/*`
- `/api/backend/user/*`
- `/api/backend/notifications*`
- `/api/backend/files*`
- سایر endpointهای authenticated یا user-specific

داده های خصوصی خواندنی فقط از React Query persistence و IndexedDB مدیریت می
شوند.

Service worker باید:

- cache version داشته باشد، مثلا conceptually `app-shell:{version}`.
- در `activate` cacheهای قدیمی را حذف کند.
- handler پیام `SKIP_WAITING` داشته باشد.
- در نبود `serviceWorker` در `navigator` هیچ خطایی ایجاد نکند.
- در development به صورت پیش فرض register نشود.
- اگر service worker قدیمی در development وجود داشت، provider بتواند با flag
  توسعه آن را unregister و cacheهای شناخته شده را پاک کند.
- private API requestها را از cache strategy خارج کند و فقط network-pass-through
  انجام دهد.

## 8. Offline page

فایل هدف:

- `src/app/(pwa)/app/offline/page.tsx` جدید

URL:

- `/app/offline`

این صفحه نباید زیر `(protected)` باشد، چون نباید برای render شدن به session
معتبر، `AuthProvider` یا API request وابسته شود.

ویژگی ها:

- کاملا بدون API call render شود.
- داخل manifest scope یعنی `/app` باشد.
- RTL و فارسی باشد.
- با tokenهای پروژه هماهنگ باشد: `bg-background`, `bg-surface`, `border-border`,
  `text-foreground`, `text-muted`, `rounded-xl`, `shadow-sm`.
- از HeroUI 3 componentهای موجود در repo مثل `Button` و در صورت نیاز `Card`
  استفاده کند.
- اکشن تلاش دوباره داشته باشد.
- لینک برگشت به `/app/tickets` داشته باشد، با این توضیح که اگر آن route هرگز
  cache نشده باشد، ممکن است دوباره offline fallback نشان داده شود.

ریسک layout:

- اگر `AuthProvider + PWALayout` در parent همه `/app` باقی بماند، `/app/offline`
  هم به auth و API وابسته می شود. راه حل دقیق این است که
  `src/app/(pwa)/layout.tsx` فعلی حذف/بازچینش شود و layout عمومی به
  `src/app/(pwa)/app/layout.tsx` منتقل شود؛ سپس `PWALayout` فقط در
  `(protected)/layout.tsx` mount شود.

## 9. Install prompt

اصل طراحی:

- event `beforeinstallprompt` باید در layout عمومی `/app` capture شود، چون ممکن
  است هنگام حضور کاربر در `/app/login` fire شود.
- UI prompt فقط در layout محافظت شده و بعد از authenticated شدن نمایش داده شود.
- install prompt و Push permission مستقل هستند و نباید هم زمان کاربر را بمباران
  کنند.

فایل های پیشنهادی:

- `src/providers/pwa-provider.tsx` جدید: capture event، standalone detection،
  service worker registration، network/update state.
- `src/hooks/use-pwa.ts` جدید: دسترسی به context یکپارچه PWA.
- `src/layouts/pwa/install-prompt.tsx` جدید: UI protected-only داخل shell.
- `messages/fa/pwa.json` جدید یا توسعه کنترل شده `messages/fa/pwaLayout.json`:
  متن های install/update/network.

رفتار:

- اگر `window.matchMedia("(display-mode: standalone)")` true بود، prompt نمایش
  داده نشود.
- برای Safari/iOS از `navigator.standalone` فقط با type guard استفاده شود.
- event `appinstalled` مدیریت و dismiss state پاک شود.
- dismiss state با TTL ذخیره شود؛ localStorage برای non-sensitive UI preference
  قابل قبول است، اما نباید داده خصوصی کاربر در آن باشد.
- prompt بلافاصله بعد از login و هم زمان با درخواست permission اعلان نمایش داده
  نشود. پیشنهاد: بعد از اولین render موفق protected shell و حداقل یک تأخیر
  کوتاه/interaction.
- اگر `beforeinstallprompt` پشتیبانی نشد، UI نصب Chrome/Edge نشان داده نشود؛
  برای iOS فقط راهنمای Add to Home Screen جداگانه و قابل dismiss ارائه شود.

## 10. React Query persistence و IndexedDB

وضعیت فعلی:

- `src/providers/react-query-provider.tsx` از React Query v5 استفاده می کند.
- cache فقط حافظه ای است.
- هیچ `@tanstack/react-query-persist-client` یا persister مرتبط در dependencyها
  نصب نیست.

روش پیشنهادی برای فاز 2:

- استفاده از TanStack Query v5 persistence با package رسمی
  `@tanstack/react-query-persist-client`، اگر در فاز implementation نصب
  dependency تایید شود.
- برای storage، IndexedDB باید به localStorage ترجیح داده شود.
- چون `@tanstack/query-async-storage-persister` در پروژه نصب نیست و localStorage
  مناسب داده خصوصی نیست، دو گزینه معتبر وجود دارد:
  - persister سفارشی کوچک با IndexedDB در
    `src/utils/pwa/indexed-db-persister.ts`.
  - نصب یک helper کوچک IndexedDB مثل `idb-keyval` در فاز implementation، پس از
    تایید dependency.

Persistence نباید کل Query Cache را ذخیره کند. allowlist باید بر اساس query
keyهای واقعی باشد:

| داده                 | query key واقعی                                                                   |
| -------------------- | --------------------------------------------------------------------------------- |
| profile/current user | `QUERY_KEYS.auth.me`                                                              |
| departments          | `QUERY_KEYS.lookups.departments`                                                  |
| tickets list         | `QUERY_KEYS.tickets.list(params)` و prefix `QUERY_KEYS.tickets.lists`             |
| ticket details       | `QUERY_KEYS.tickets.details(ticketId)`                                            |
| notifications list   | `QUERY_KEYS.notifications.list(params)` و prefix `QUERY_KEYS.notifications.lists` |
| unread count         | `QUERY_KEYS.notifications.unreadCount`                                            |

داده هایی که persist نمی شوند:

- token، cookie، credentials، username/password form values.
- فرم های تغییر گذرواژه.
- mutation state.
- upload progress.
- attachment Blob.
- error responseهای حساس.
- هر داده ای که به user فعلی تعلق ندارد یا user scope آن معلوم نیست.

الزام های persistence:

- schema/app version داشته باشد.
- `buster` داشته باشد تا با deployهای ناسازگار invalidate شود.
- `maxAge` مشخص داشته باشد؛ پیشنهاد اولیه برای داده های ticket/notification
  کوتاه تا متوسط است، مثلا 24 ساعت، و برای departments کمی طولانی تر، اما همه
  user-scoped بمانند.
- cache key persisted باید user-scoped باشد، مثلا conceptually
  `query-cache:{user-id}:{schema-version}`.
- اگر user id پیش از `auth.me` در دسترس نیست، bootstrap دو مرحله ای لازم است:
  1. قبل از مشخص شدن user، هیچ cache خصوصی hydrate و نمایش داده نشود.
  2. بعد از موفقیت `auth.me` و مشخص شدن `user.id`، persister مربوط به همان user
     hydrate شود.
- در logout، 401، token invalidation و تغییر user باید React Query cache و
  IndexedDB persistence خصوصی پاک شود.
- روی shared device نباید cache کاربر قبلی به کاربر بعدی نمایش داده شود. این مهم
  ترین ریسک privacy در offline read است.

## 11. Offline read behavior صفحه به صفحه

هدف offline read این نیست که صفحه ای که هرگز آنلاین باز نشده، حتما آفلاین کار
کند. هدف این است که آخرین داده موفق قبلی، فقط برای همان user، در محدوده cache
موجود قابل مشاهده باشد.

| صفحه/داده                                 | loader فعلی                                                                                             | مشکل hard refresh آفلاین                                                         | نقش Service Worker                                                            | نقش Query persistence                                                                   | UI لازم                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Tickets list `/app/tickets`               | `TicketsModule` با `connection()` و `getTicketsInitialData`; خطای tickets به empty + error تبدیل می شود | بدون SW صفحه shell نمی آید؛ با SW ممکن است server data تازه نیاید                | navigation cached یا `/app/offline` را برمی گرداند                            | `QUERY_KEYS.tickets.list(params)` و departments را بعد از hydrate نشان می دهد           | badge «داده ذخیره شده»، آخرین بروزرسانی، retry پس از آنلاین شدن         |
| Departments lookup                        | در tickets/create با `serverLookupServices.getDepartments`; در list خطا به `[]` تبدیل می شود            | create form ممکن است departments خالی داشته باشد                                 | فقط shell را حفظ می کند                                                       | `QUERY_KEYS.lookups.departments` آخرین لیست را برمی گرداند                              | اگر offline است select read-only/disabled با پیام مناسب                 |
| Ticket details `/app/tickets/[ticket-id]` | `getTicketDetailsInitialData` روی server؛ 404 را `notFound` و خطای دیگر را throw می کند                 | آسیب پذیرترین مسیر؛ hard refresh آفلاین قبل از client fallback ممکن است fail شود | اگر navigation response قبلا cache شده باشد صفحه می آید، وگرنه `/app/offline` | `QUERY_KEYS.tickets.details(ticketId)` آخرین detail را پس از client hydrate نشان می دهد | نمایش stale بودن گفتگو، disable ارسال پیام و upload در offline          |
| Notifications `/app/notifications`        | `getNotificationsInitialData`; خطا به empty + error تبدیل می شود                                        | بدون SW shell نمی آید؛ با SW cached shell می آید                                 | navigation cached یا offline fallback                                         | `QUERY_KEYS.notifications.list(params)` و `unreadCount` را restore می کند               | نشان دادن آخرین sync؛ disable mark read و mark all read در offline      |
| Profile `/app/profile`                    | client-only از `useAuth()` و `QUERY_KEYS.auth.me`                                                       | بدون persisted user، profile error state می آید                                  | shell را حفظ می کند                                                           | `QUERY_KEYS.auth.me` پس از user-scoped hydrate آخرین profile را می دهد                  | نمایش cached profile؛ disable update profile/change password در offline |

برای ticket details، راه حل دقیق در فاز 2 این است که بعد از فعال شدن SW
navigation cache و user-scoped persistence، مسیر details بتواند از cache قبلی
hydrate شود. اگر صفحه details هرگز آنلاین باز نشده باشد، باید `/app/offline` یا
state واضح «این صفحه قبلا ذخیره نشده» نشان داده شود، نه ادعای دسترسی کامل
آفلاین.

زمان آخرین sync:

- بهتر است برای هر persisted query metadata سبک شامل `lastSuccessfulFetchAt`
  ذخیره شود.
- در UI با متن فارسی از i18n نشان داده شود، مثل «آخرین بروزرسانی ذخیره شده:
  ...».
- اگر داده از network تازه آمد، indicator حذف یا به «به روز» تبدیل شود.

## 12. Online-only operations

هیچ یک از عملیات زیر وارد queue آفلاین نمی شوند.

| عملیات                         | فایل/سرویس فعلی                                             | رفتار در offline                                                                                          |
| ------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Login                          | `LoginModule`, `clientAuthServices.login`                   | دکمه submit disabled یا پس از تلاش پیام «برای ورود به اینترنت نیاز دارید»؛ retry بعد از اتصال             |
| Register                       | `RegisterModule`, `clientAuthServices.register`             | فقط آنلاین؛ پیام نیاز به اتصال                                                                            |
| Logout backend request         | `AuthProvider.logout`, `/api/backend/auth/logout`           | backend request best effort؛ local cleanup باید انجام شود حتی اگر network نبود                            |
| Create ticket                  | `CreateTicketForm`, `clientTicketServices.createTicket`     | submit و upload disabled؛ پیام «ایجاد تیکت در حالت آفلاین ممکن نیست»                                      |
| Send message                   | `MessageComposer`, `clientTicketServices.sendTicketMessage` | composer disabled؛ اگر ticket closed است پیام closed فعلی اولویت دارد، اگر offline است پیام نیاز به اتصال |
| Upload file                    | `clientFileServices.uploadFile`                             | file input/drop disabled؛ هیچ Blob برای sync ذخیره نمی شود                                                |
| Update profile                 | `ProfileEditor`, `clientAuthServices.updateProfile`         | submit و image upload disabled؛ فرم می تواند read-only بماند                                              |
| Change password                | `AccountSecurity`, `clientAuthServices.changePassword`      | کاملا online-only و disabled در offline                                                                   |
| Mark notification as read      | `NotificationsClient.markReadMutation`                      | در offline اجرا نشود؛ notification فقط باز شود اگر href قابل مشاهده است، read state تغییر نکند            |
| Mark all notifications as read | `NotificationsClient.markAllReadMutation`                   | disabled در offline                                                                                       |

UX مشترک:

- network indicator در protected shell نشان دهد کاربر offline است.
- write buttons با `isDisabled` واقعی HeroUI غیرفعال شوند.
- پیام های فارسی از i18n بیاید.
- وقتی اتصال برگشت، actionها دوباره فعال شوند و کاربر بتواند دستی retry کند.

## 13. Update lifecycle

این بخش فاز مستقل سوم است.

نیازها:

- تشخیص waiting worker.
- نمایش UI «نسخه جدید آماده است» داخل protected shell.
- استفاده از HeroUI 3 componentهای واقعی پروژه، مثل `Button` و `Toast.Provider`
  موجود.
- ارسال پیام `SKIP_WAITING` به waiting worker پس از تایید کاربر.
- مدیریت `controllerchange`.
- reload کنترل شده فقط یک بار؛ جلوگیری از reload loop با flag در memory/session.
- پاکسازی cacheهای نسخه قدیمی در `activate`.
- هماهنگی versioning بین service worker cache و persisted query cache buster.
- توضیح رفتار deploy: نسخه جدید SW نصب می شود، waiting می ماند، کاربر تایید می
  کند، SW جدید activate می شود، cacheهای قدیمی حذف می شوند، صفحه یک بار reload
  می شود.

UI پیشنهادی:

- یک banner کوچک و غیرمزاحم داخل `PWALayout` یا component زیر
  `src/layouts/pwa/update-available.tsx`.
- کلاس ها مطابق پروژه: `bg-surface`, `border-border`, `rounded-xl`, `shadow-sm`,
  `text-body-sm`, `button button--md`.

## 14. Push Notification و وابستگی Backend

Push در scope پروژه هست، اما فاز چهارم و مستقل است. در وضعیت فعلی:

- frontend هیچ `PushManager`, `Notification API`, subscription flow یا service
  worker push handler ندارد.
- backend docs فقط `GET /notifications`, `PATCH /notifications/{id}/read`,
  `PATCH /notifications/read-all` را تعریف کرده اند.
- endpoint قطعی برای Web Push subscription وجود ندارد و نباید در این گزارش
  اختراع شود.

Feature detection frontend:

- `typeof window !== 'undefined'`
- `window.isSecureContext`
- `'serviceWorker' in navigator`
- `'PushManager' in window`
- `'Notification' in window`

فایل های احتمالی فاز 4:

- توسعه `public/sw.js` برای `push` و `notificationclick`.
- `src/hooks/use-push-notifications.ts` جدید، فقط اگر جریان push از provider
  اصلی جدا شود.
- `src/layouts/pwa/push-permission-prompt.tsx` جدید، protected-only و بعد از
  آماده شدن backend.
- سرویس API جدید برای push subscription فقط بعد از طراحی backend، زیر convention
  موجود `src/apis/services/<feature>`.

قواعد:

- permission فقط بعد از تعامل صریح کاربر درخواست شود.
- تا زمانی که backend subscription API و VAPID آماده نیست، UI درخواست permission
  فعال نشود.
- install prompt و push permission دو جریان مستقل هستند.
- payload push باید حداقلی باشد و اطلاعات حساس تیکت روی lock screen نمایش داده
  نشود.
- notification click:
  - اگر payload لینک ticket معتبر داشت، `/app/tickets/{id}` باز شود.
  - در غیر این صورت `/app/notifications`.
  - اگر window موجود هست focus شود، وگرنه `clients.openWindow`.
- fallback بدون push: notifications list و unread polling فعلی ادامه پیدا کند.

## 15. امنیت و حریم خصوصی

- `access_token` در cookie `httpOnly` است و نباید وارد JS/IndexedDB/localStorage
  شود.
- Service worker نباید Authorization header بسازد یا token بخواند.
- private APIها وارد Cache Storage نشوند.
- React Query persistence باید user-scoped باشد.
- cache خصوصی باید در logout، 401، token invalidation و تغییر user پاک شود.
- قبل از مشخص شدن user id نباید داده خصوصی hydrate شود.
- shared device ریسک اصلی است؛ cache user قبلی نباید حتی برای لحظه ای به user
  بعدی نمایش داده شود.
- فایل های attachment و Blobها برای sync آفلاین ذخیره نمی شوند.
- password، credential، mutation state و errorهای حساس persist نمی شوند.
- push payload باید حداقلی و privacy-aware باشد.
- User فقط باید داده ها و تیکت های خودش را ببیند؛ persistence نباید access
  control backend را دور بزند.

## 16. هماهنگی با SRS

براساس `docs/design system spec.txt` و `docs/API-Design.txt`:

- User app برای submit و tracking تیکت است.
- Ticket conversation چت real-time نیست؛ WebSocket و real-time chat خارج از
  scope فعلی است.
- Push Notification به معنی اضافه کردن چت real-time نیست؛ فقط delivery channel
  جدید برای اعلان است.
- اعلان داخلی فعلی list/read دارد و با Web Push متفاوت است.
- پس از `CLOSED` شدن تیکت، ارسال پیام مجاز نیست؛ UI فعلی `MessageComposer` همین
  rule را با state بسته رعایت می کند.
- فایل ها باید اول با `POST /files` آپلود شوند و سپس `fileIds` ارسال شود.
- محدودیت فایل در constants فعلی آمده است: `TICKET_ATTACHMENT_MAX_FILES`,
  `TICKET_ATTACHMENT_MAX_SIZE`, allowed extensions.
- profile image هم اول upload و بعد `PATCH /auth/me` می شود.
- داده های user، ticket، notification و profile خصوصی هستند و باید user-scoped
  persist شوند.

هر قابلیت PWA که ممکن است این قواعد را دور بزند حذف شده است؛ مخصوصا offline send
و attachment sync.

## 17. هماهنگی با HeroUI، Tailwind و i18n

HeroUI:

- پروژه از HeroUI 3 compound components استفاده می کند: `Button`, `Card`,
  `TextField`, `Input`, `Label`, `FieldError`, `TextArea`, `Select`, `ListBox`,
  `Dropdown`, `Toast.Provider`.
- برای UIهای PWA باید همین الگو استفاده شود.
- از APIهای قدیمی، providerهای فرضی یا `classNames`های ناموجود استفاده نشود.
- Buttonها با props فعلی مثل `variant`, `size`, `isDisabled`, `isPending`,
  `onPress` و کلاس های موجود `button button--md` طراحی شوند.

Tailwind/CSS:

- پروژه Tailwind CSS 4 دارد و tokenها در CSS هستند، نه config سنتی.
- رنگ ها و spacing از tokenهای فعلی بیاید:
  - background: `#fafafa` / `bg-background`
  - surface: `bg-surface`
  - accent/primary: `#2563eb`, `bg-accent`, `text-accent`
  - warning: `bg-warning-soft`, `text-warning-600`
  - danger: `bg-danger-soft`, `text-danger-600`
  - border: `border-border`
  - radius: `rounded-xl`, `rounded-lg`, `rounded-md`
  - typography: `text-h3`, `text-title`, `text-body-sm`, `text-caption`
- PWA shell spacing باید از `src/layouts/pwa/shared.ts` reuse شود:
  `PWA_SHELL_CONTAINER_CLASS`, `PWA_HEADER_HEIGHT_CLASS`, i18n:

- همه copyهای جدید باید فارسی و از `next-intl` بیاید.
- namespaceهای فعلی در `src/i18n/request.ts` و `global.d.ts` دستی import/type
  شده اند.
- اگر `messages/fa/pwa.json` یا `messages/fa/offline.json` اضافه شود، باید در هر
  دو فایل wire شود.
- اگر به جای فایل جدید، `pwaLayout.json` توسعه پیدا کند، باز هم type/import فعلی
  نیاز به فایل جدید ندارد، اما حجم namespace layout زیاد می شود. پیشنهاد: برای
  install/update/network از `messages/fa/pwa.json` و برای offline page از
  `messages/fa/offline.json` استفاده شود.

## 18. migration plan مسیرهای auth

تصمیم قطعی: auth زیر `/app` منتقل می شود.

کارهای لازم در فاز 1:

- `src/app/(auth)/login/page.tsx` به `src/app/(pwa)/app/(auth)/login/page.tsx`
  move شود.
- `src/app/(auth)/register/page.tsx` به
  `src/app/(pwa)/app/(auth)/register/page.tsx` move شود.
- `src/app/(auth)/layout.tsx` به `src/app/(pwa)/app/(auth)/layout.tsx` move شود
  یا thin layout جدید بسازد که `AuthLayout` فعلی را reuse کند.
- `ROUTES.login` از `/login` به `/app/login` تغییر کند.
- `ROUTES.register` از `/register` به `/app/register` تغییر کند.
- `LoginModule` و `RegisterModule` چون از `ROUTES` استفاده می کنند، با تغییر
  constants مقصد لینک ها و redirectها را می گیرند.
- `clientApiClient` 401 redirect هم به واسطه `ROUTES.login` داخل standalone
  scope می ماند.
- `AuthProvider.logout` بعد از migration به `/app/login` redirect می کند.

Redirectهای موقت:

- اگر پروژه deploy شده یا لینک های قدیمی محتمل است، routeهای `/login` و
  `/register` به صورت موقت به `/app/login` و `/app/register` redirect شوند.
- اگر backward compatibility لازم نیست، مسیرهای قدیمی می توانند حذف شوند.

## 19. file-by-file implementation plan

| فایل                                                    | وضعیت             | فاز       | چرا تغییر/اضافه می شود                                                                           | مسئولیت                                                                         | وابستگی                                                      |
| ------------------------------------------------------- | ----------------- | --------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src/app/layout.tsx`                                    | موجود             | 1         | احتمالا فقط metadata/icons عمومی را با manifest هماهنگ نگه می دارد؛ نباید PWA route-specific شود | global html/provider/metadata                                                   | `AppProviders`, `mainLayout`                                 |
| `src/app/manifest.ts`                                   | جدید              | 1         | file convention رسمی App Router برای installability                                              | manifest با scope `/app`, shortcuts, icons                                      | `MetadataRoute`, token/color constants یا مقادیر استخراج شده |
| `src/app/(pwa)/layout.tsx`                              | موجود             | 1         | ساختار فعلی با target ناسازگار است چون auth/shell را به همه `/app` می دهد                        | باید حذف/بازچینش شود یا مسئولیتش به `src/app/(pwa)/app/layout.tsx` منتقل شود    | route architecture                                           |
| `src/app/(pwa)/app/layout.tsx`                          | جدید              | 1         | layout عمومی `/app` بدون auth forcing                                                            | mount `PWAProvider` و children                                                  | `src/providers/pwa-provider.tsx`                             |
| `src/app/(pwa)/app/offline/page.tsx`                    | جدید              | 1         | offline fallback داخل scope `/app`                                                               | render صفحه offline بدون API                                                    | `OfflineModule`, i18n                                        |
| `src/modules/offline/index.tsx`                         | جدید              | 1         | مطابق convention moduleها، UI offline از route جدا شود                                           | صفحه فارسی offline با retry/link                                                | HeroUI `Button`, `ROUTES`, messages                          |
| `src/app/(pwa)/app/(auth)/layout.tsx`                   | جدید/move         | 1         | guest layout زیر `/app`                                                                          | render `AuthLayout` و redirect authenticated به tickets                         | `src/layouts/auth`                                           |
| `src/app/(pwa)/app/(auth)/login/page.tsx`               | جدید/move         | 1         | URL نهایی `/app/login`                                                                           | render `LoginModule`                                                            | `src/modules/login`                                          |
| `src/app/(pwa)/app/(auth)/register/page.tsx`            | جدید/move         | 1         | URL نهایی `/app/register`                                                                        | render `RegisterModule`                                                         | `src/modules/register`                                       |
| `src/app/(pwa)/app/(protected)/layout.tsx`              | جدید              | 1         | protected-only shell                                                                             | mount `AuthProvider`, guard, `PWALayout`, protected PWA UI                      | `AuthProvider`, `PWALayout`, `useAuth`                       |
| `src/app/(pwa)/app/(protected)/tickets/**`              | move از مسیر فعلی | 1         | جلوگیری از collision و قرارگیری زیر protected layout                                             | صفحات tickets                                                                   | `TicketsModule`, `CreateTicketModule`, `TicketDetailsModule` |
| `src/app/(pwa)/app/(protected)/notifications/page.tsx`  | move از مسیر فعلی | 1         | زیر protected layout                                                                             | صفحه notifications                                                              | `NotificationsModule`                                        |
| `src/app/(pwa)/app/(protected)/profile/page.tsx`        | move از مسیر فعلی | 1         | زیر protected layout                                                                             | صفحه profile                                                                    | `ProfileModule`                                              |
| `src/app/(auth)/**`                                     | موجود             | 1         | مسیرهای قدیمی `/login`, `/register` حذف یا redirect موقت شوند                                    | backward compatibility اختیاری                                                  | `redirect`, `ROUTES`                                         |
| `src/constants/routes.ts`                               | موجود             | 1         | auth URLها تغییر می کنند و offline route اضافه می شود                                            | route source of truth                                                           | همه modules/layouts                                          |
| `src/layouts/auth/index.tsx`                            | موجود             | 1         | redirect authenticated باید با route جدید هماهنگ بماند                                           | guest auth shell                                                                | `AUTH_COOKIE_NAME`, `ROUTES.tickets`                         |
| `src/layouts/pwa/index.tsx`                             | موجود             | 1 و 3     | محل shell protected و UIهای protected PWA                                                        | header/main/bottom nav، جای install/update/network UI                           | `AppHeader`, `BottomNavigation`, pwa context                 |
| `src/layouts/pwa/install-prompt.tsx`                    | جدید              | 1         | UI سفارشی نصب بعد از auth                                                                        | نمایش prompt/dismiss                                                            | `usePwa`, HeroUI, messages                                   |
| `src/layouts/pwa/network-indicator.tsx`                 | جدید              | 1         | اطلاع subtle offline                                                                             | نمایش offline/online restoring                                                  | `usePwa`, messages                                           |
| `src/layouts/pwa/update-available.tsx`                  | جدید              | 3         | UI نسخه جدید                                                                                     | trigger `SKIP_WAITING`                                                          | `usePwa`, HeroUI                                             |
| `src/providers/pwa-provider.tsx`                        | جدید              | 1 و 3 و 4 | یک provider سطح بالا برای جلوگیری از چند provider ریز                                            | SW registration, install event, standalone, network, update, push support flags | browser APIs                                                 |
| `src/hooks/use-pwa.ts`                                  | جدید              | 1         | دسترسی typed به PWA context                                                                      | مصرف در layout UI                                                               | `PWAContext`                                                 |
| `src/providers/react-query-provider.tsx`                | موجود             | 2         | اضافه کردن persistence read-only و user-scoped بعد از bootstrap                                  | QueryClient + persister integration                                             | TanStack Query v5, IndexedDB helper                          |
| `src/utils/pwa/indexed-db-persister.ts`                 | جدید              | 2         | IndexedDB persister بدون ذخیره کل cache                                                          | read/write/remove persisted cache                                               | IndexedDB API یا dependency تایید شده                        |
| `src/utils/pwa/query-persistence.ts`                    | جدید              | 2         | allowlist/predicate و buster/schema                                                              | انتخاب queryهای مجاز                                                            | `QUERY_KEYS`                                                 |
| `src/utils/pwa/support.ts`                              | جدید              | 1 و 4     | feature detection امن                                                                            | service worker/install/standalone/push checks                                   | browser APIs                                                 |
| `src/utils/index.ts`                                    | موجود             | 1/2       | export explicit helperهای جدید طبق convention                                                    | public import از `@/utils`                                                      | فایل های `src/utils/pwa/*`                                   |
| `src/apis/core/client/api-client.ts`                    | موجود             | 1 و 2     | 401 redirect و purge persistence                                                                 | redirect به `/app/login`, پاکسازی cache خصوصی                                   | `ROUTES`, persistence cleanup                                |
| `src/providers/auth-provider.tsx`                       | موجود             | 1 و 2     | logout باید persistence خصوصی را پاک کند                                                         | local cleanup + query clear + redirect                                          | React Query, PWA persistence cleanup                         |
| `src/hooks/use-get-request.ts`                          | موجود             | 2         | شاید metadata آخرین sync و cached/stale state اضافه شود                                          | central read state                                                              | React Query query metadata                                   |
| `src/hooks/use-post-request.ts`                         | موجود             | 1         | برای offline write disable لازم نیست queue اضافه شود؛ شاید فقط error message network هماهنگ شود  | mutation state فعلی                                                             | common messages                                              |
| `src/modules/tickets/tickets-client.tsx`                | موجود             | 2         | نمایش cached/stale و last sync                                                                   | list offline read UI                                                            | `QUERY_KEYS.tickets.*`, network state                        |
| `src/modules/ticket-details/ticket-details-content.tsx` | موجود             | 2         | نمایش cached details و disable composer offline                                                  | detail offline read                                                             | `QUERY_KEYS.tickets.details`, network state                  |
| `src/modules/ticket-details/message-composer.tsx`       | موجود             | 1/2       | write action offline disabled شود                                                                | online-only send/upload                                                         | network state, messages                                      |
| `src/modules/create-ticket/create-ticket-form.tsx`      | موجود             | 1/2       | create/upload offline disabled شود                                                               | online-only create                                                              | network state, messages                                      |
| `src/modules/notifications/notifications-client.tsx`    | موجود             | 2         | list cached/stale، mark read offline disabled                                                    | online-only notification writes                                                 | network state                                                |
| `src/modules/profile/profile-editor.tsx`                | موجود             | 2         | profile update/upload offline disabled                                                           | online-only profile edit                                                        | network state                                                |
| `src/modules/profile/account-security.tsx`              | موجود             | 2         | change password offline disabled                                                                 | online-only password change                                                     | network state                                                |
| `messages/fa/pwa.json`                                  | جدید              | 1/3/4     | copyهای install/network/update/push                                                              | متن فارسی PWA                                                                   | `src/i18n/request.ts`, `global.d.ts`                         |
| `messages/fa/offline.json`                              | جدید              | 1         | copy صفحه offline                                                                                | متن فارسی offline page                                                          | `src/i18n/request.ts`, `global.d.ts`                         |
| `src/i18n/request.ts`                                   | موجود             | 1         | wire namespaceهای جدید                                                                           | message loader                                                                  | JSONهای جدید                                                 |
| `global.d.ts`                                           | موجود             | 1         | type namespaceهای جدید                                                                           | next-intl typings                                                               | JSONهای جدید                                                 |
| `public/sw.js`                                          | جدید              | 1 و 3 و 4 | service worker دستی                                                                              | navigation/static caching, update, push handlers                                | browser SW APIs                                              |
| `public/icons/icon-192.png`                             | جدید              | 1         | manifest icon                                                                                    | installability                                                                  | طراحی icon                                                   |
| `public/icons/icon-512.png`                             | جدید/derived      | 1         | manifest icon                                                                                    | installability                                                                  | logo existing                                                |
| `public/icons/maskable-512.png`                         | جدید              | 1         | maskable icon safe zone                                                                          | adaptive icons                                                                  | طراحی مستقل                                                  |
| `src/app/apple-icon.png` یا equivalent                  | جدید/اختیاری      | 1         | iOS home screen icon                                                                             | apple touch icon                                                                | Next app icons convention                                    |
| `src/apis/services/push/*`                              | جدید/مشروط        | 4         | فقط بعد از backend API                                                                           | subscribe/unsubscribe                                                           | backend/VAPID                                                |

## 20. فازبندی نهایی چهارمرحله ای

### فاز 1: PWA پایه و Installability

- انتقال routeهای auth به `/app/login` و `/app/register`.
- اصلاح `ROUTES` و redirectهای auth/401/logout.
- ایجاد layout عمومی `/app` و layoutهای `(auth)` و `(protected)`.
- ایجاد `manifest.ts`.
- تکمیل iconها شامل 192، 512، maskable و احتمالا apple icon.
- service worker registration در production.
- `public/sw.js` با navigation fallback.
- `/app/offline`.
- install prompt سفارشی بعد از auth.
- standalone detection.
- network indicator.
- development cleanup برای SW قدیمی.

### فاز 2: Offline Read و Persistence

- IndexedDB persister.
- React Query allowlist.
- user-scoped cache.
- schema version و buster.
- purge در logout، 401 و تغییر user.
- persistence برای tickets، ticket details، departments، notifications و
  profile.
- cached/stale indicator.
- last sync time.
- بررسی hard refresh آفلاین، مخصوصا ticket details.
- disable همه write actionها در offline.

### فاز 3: Update Lifecycle

- versioned caches.
- waiting worker detection.
- update available UI.
- `SKIP_WAITING`.
- `controllerchange`.
- reload کنترل شده.
- cache cleanup.
- جلوگیری از reload loop.
- هماهنگی SW version با query persistence buster.

### فاز 4: Web Push Notification

- feature detection.
- permission flow بعد از interaction.
- subscribe/unsubscribe frontend پس از آماده شدن backend.
- push handler.
- notification click handler.
- dependency روشن به Backend API.
- dependency روشن به VAPID.
- privacy rules.
- fallback به notifications list و unread polling.

## 21. معیارهای پذیرش هر فاز

### فاز 1

- `/app/login` و `/app/register` render شوند و داخل scope `/app` باشند.
- `/login` و `/register` یا حذف شده باشند یا redirect موقت به مسیرهای جدید
  بدهند.
- هیچ دو route group به URL یکسان resolve نشوند.
- `/app/tickets` از manifest نصب پذیر باشد.
- manifest شامل `scope: "/app"` و `start_url: "/app/tickets"` باشد.
- iconهای 192، 512 و maskable واقعی وجود داشته باشند.
- `/app/offline` بدون API request render شود.
- در production service worker register شود و در development به صورت پیش فرض
  register نشود.
- private APIها در Cache Storage ذخیره نشوند.
- install prompt فقط بعد از authenticated شدن و خارج از standalone نمایش داده
  شود.
- session منقضی شده در standalone به `/app/login` redirect شود، نه `/login`.

### فاز 2

- React Query cache منتخب در IndexedDB ذخیره شود، نه کل cache.
- persisted cache با user id scope شود.
- cache کاربر قبلی به کاربر بعدی نمایش داده نشود.
- logout همه persistence خصوصی را پاک کند.
- 401 یا invalid session persistence خصوصی را پاک کند.
- صفحه ای که قبلا آنلاین باز شده، در حد cache موجود آفلاین قابل مشاهده باشد.
- صفحه ای که هرگز باز نشده، ادعای offline availability نداشته باشد.
- tickets list، ticket details، notifications، profile و departments آخرین داده
  موفق را نشان دهند.
- cached/stale indicator و last sync time قابل مشاهده باشد.
- create ticket، send message، upload file، update profile، change password،
  mark read و mark all read در offline غیرفعال باشند.

### فاز 3

- وقتی SW جدید waiting است، UI «نسخه جدید آماده است» نمایش داده شود.
- با تایید کاربر `SKIP_WAITING` ارسال شود.
- `controllerchange` باعث reload فقط یک بار شود.
- reload loop رخ ندهد.
- cacheهای نسخه قدیمی در activate حذف شوند.
- query persistence buster با نسخه ناسازگار invalidate شود.
- deploy نسخه جدید بدون گیر کردن کاربر روی assetهای قدیمی مدیریت شود.

### فاز 4

- Push permission فقط بعد از تعامل صریح کاربر و فقط پس از آماده شدن backend
  درخواست شود.
- اگر Service Worker، PushManager، Notification API یا secure context موجود
  نبود، UI مناسب fallback نشان دهد و app crash نکند.
- subscribe/unsubscribe به API backend نهایی وصل شود.
- push handler notification را با payload حداقلی نمایش دهد.
- notification click window موجود را focus کند یا مسیر درست را باز کند.
- اگر ticket link معتبر نبود، `/app/notifications` باز شود.
- بدون push، notifications list و unread polling همچنان کار کند.

## 22. ریسک ها و موارد باز

- Backend Web Push API هنوز تعریف نشده است؛ فاز 4 به طراحی جداگانه backend و
  VAPID نیاز دارد.
- ذخیره offline داده های خصوصی روی shared device ریسک privacy دارد؛ user-scoped
  hydrate و purge سخت گیرانه الزامی است.
- ticket details در hard refresh آفلاین آسیب پذیر است، چون initial data فعلی
  server-side است و خطای غیر 404 را throw می کند.
- service worker دستی بدون build integration نمی تواند precache دقیق همه
  `_next/static/*` را با manifest hash شده مدیریت کند.
- اگر `/app/offline` زیر layout اشتباه قرار بگیرد، به auth/API وابسته می شود و
  هدف offline شکست می خورد.
- اگر redirectهای قدیمی `/login` و `/register` باقی بمانند، باید مراقب scope
  `/app` و تجربه standalone بود.
- نصب PWA و push permission رفتار مرورگر/OS-dependent دارند؛ progressive
  enhancement باید معیار اصلی باشد.
- نام و short name نهایی برند باید با مالک محصول تایید شود؛ فعلا منبع واقعی
  `mainLayout` و `common.brand.appName` است.
- maxAge دقیق داده های persisted باید با سیاست محصول/امنیت تایید شود.
- تصمیم نصب dependency برای persister IndexedDB در فاز implementation باز است.

## 23. ترتیب پیشنهادی شروع پیاده سازی

1. route migration را انجام بده: auth زیر `/app`، protected layout، offline خارج
   protected، و حذف conflictهای route.
2. `ROUTES` و redirectهای auth/401/logout را به مسیرهای جدید هماهنگ کن.
3. `manifest.ts` و iconهای لازم را اضافه کن.
4. `PWAProvider` مینیمال را برای feature detection، network state، install event
   و production-only SW registration اضافه کن.
5. `public/sw.js` مینیمال را با navigation fallback و عدم cache private API
   اضافه کن.
6. `/app/offline` و UIهای install/network را با i18n اضافه کن.
7. بعد از تثبیت فاز 1، React Query persistence user-scoped و IndexedDB را در فاز
   2 اضافه کن.
8. سپس update lifecycle را جدا تست کن.
9. Push را فقط بعد از مشخص شدن API backend و VAPID شروع کن.

## Decisions Confirmed

- auth زیر `/app` منتقل می شود.
- routeهای جدید `/app/login` و `/app/register` هستند.
- manifest scope برابر `/app` است.
- start URL برابر `/app/tickets` است.
- offline page برابر `/app/offline` و خارج `(protected)` است.
- APIهای خصوصی در Cache Storage ذخیره نمی شوند.
- داده های خواندنی منتخب در IndexedDB persist می شوند.
- persisted cache باید user-scoped باشد.
- logout و 401 باید cache خصوصی را پاک کنند.
- offline mutations پیاده سازی نمی شوند.
- draft آفلاین پیاده سازی نمی شود.
- Background Sync پیاده سازی نمی شود.
- attachment offline storage پیاده سازی نمی شود.
- Push Notification در فاز چهارم پیاده سازی می شود.
- APIهای Push بعدا جداگانه طراحی و در Backend اضافه می شوند.
- install prompt و Push permission از هم مستقل هستند.
- Service Worker در production فعال و در development به صورت پیش فرض غیرفعال
  است.
- از نسخه واقعی و فعلی Next.js، Tailwind و HeroUI پروژه استفاده می شود.
- ساختار و conventionهای فعلی repository باید حفظ شوند.
