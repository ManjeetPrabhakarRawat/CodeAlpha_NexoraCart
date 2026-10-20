# 🛍️ NexoraCart

NexoraCart is a production-grade full-stack MERN e-commerce platform built to provide a secure, scalable, and responsive online shopping experience.

The platform combines product discovery, category-based shopping, search, personalized cart and wishlist management, secure authentication, checkout and order processing, and role-based administration into a unified e-commerce application.

---

## 🌐 Live Demo

🚀 Live Application: `Coming Soon`

🔗 Backend API: `Coming Soon`

---

## 🚀 Features

### 🛒 Shopping Experience

- Modern and responsive e-commerce interface
- Product browsing across multiple categories
- Category-based product discovery
- Product search by name, description, and category
- Product detail pages
- Shopping cart management
- Personalized wishlist
- Responsive checkout experience
- Stock-aware shopping experience
- No-results state for unsuccessful searches

### 📦 Product Management

- Product creation and management
- Product editing and deletion
- Category-based organization
- Product pricing and discount information
- Product ratings and review counts
- Stock management
- Featured products
- Product images
- Server-side product data validation

### 🧾 Order Management

- Secure order creation
- Customer-specific order history
- Detailed order information
- Order item information
- Server-side price calculation
- Server-side stock validation
- Order status management
- Admin-controlled order processing
- Customer order isolation

### ❤️ Personalized User Experience

- Account-specific shopping cart
- Account-specific wishlist
- Account-specific order history
- Profile management
- Settings management
- Persistent customer data across sessions
- Strict separation between customer accounts

### 👨‍💼 Admin Dashboard

- Dedicated admin dashboard
- Product management
- Customer order management
- Order status updates
- Role-based administrative access
- Backend-enforced authorization
- Customer and admin account separation
- Admin restricted from customer checkout flow

### 🔐 Secure Authentication

- JWT-based authentication
- JWT stored in HTTP-only cookies
- bcrypt password hashing
- CSRF protection
- Role-based access control
- Protected routes
- Backend-enforced authorization
- Secure session handling
- Environment-based secrets

### 📱 Responsive Design

- Desktop-optimized layout
- Tablet support
- Mobile-friendly interface
- Responsive navigation
- Mobile category navigation
- Responsive product grids
- No intentional horizontal overflow
- Adaptive checkout and account pages

---

## 🛠️ Technology Stack

### 🎨 Frontend

- React
- Vite
- JavaScript
- React Router
- Context API
- CSS

### ⚙️ Backend

- Node.js
- Express.js
- JavaScript
- JWT
- bcryptjs
- Helmet
- CORS
- express-rate-limit
- cookie-parser

### 🗄️ Database

- MongoDB
- Mongoose

---

## 🏗️ Architecture

```mermaid
flowchart LR

    U[👤 Customer] --> FE[🌐 React + Vite Frontend]

    FE --> AUTH[🔐 Authentication]
    FE --> PROD[🛍️ Products]
    FE --> CART[🛒 Cart]
    FE --> WISH[❤️ Wishlist]
    FE --> CHECK[💳 Checkout]
    FE --> ORD[📦 Orders]
    FE --> ADMIN[👨‍💼 Admin Dashboard]

    AUTH --> API[⚙️ Node.js + Express API]
    PROD --> API
    CART --> API
    WISH --> API
    CHECK --> API
    ORD --> API
    ADMIN --> API

    API --> MW[🛡️ Security Middleware]
    API --> CTRL[🎯 Controllers]
    CTRL --> MODEL[📦 Mongoose Models]
    MODEL --> DB[(🗄️ MongoDB)]

    MW --> JWT[🔑 JWT + HTTP-only Cookies]
    MW --> CSRF[🛡️ CSRF Protection]
    MW --> RBAC[👮 Role-based Access]
    MW --> RATE[🚦 Rate Limiting]
    MW --> HELMET[🪖 Helmet + CORS]

    ADMIN --> AP[📊 Product Management]
    ADMIN --> AO[📋 Order Management]

    AP --> API
    AO --> API

🔄 E-commerce Order Flow
#chatgpt-mermaid-_r_5e7_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;font-size:16px;fill:rgb(13, 13, 13);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-_r_5e7_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_5e7_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_5e7_ .error-icon{fill:rgb(243, 243, 243);}#chatgpt-mermaid-_r_5e7_ .error-text{fill:rgb(13, 13, 13);stroke:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5e7_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-_r_5e7_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-_r_5e7_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-_r_5e7_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-_r_5e7_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-_r_5e7_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-_r_5e7_ .marker{fill:rgb(143, 143, 143);stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_5e7_ .marker.cross{stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_5e7_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;font-size:16px;}#chatgpt-mermaid-_r_5e7_ p{margin:0;}#chatgpt-mermaid-_r_5e7_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5e7_ .cluster-label text{fill:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5e7_ .cluster-label span{color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5e7_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-_r_5e7_ .label text,#chatgpt-mermaid-_r_5e7_ span{fill:rgb(13, 13, 13);color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5e7_ .node rect,#chatgpt-mermaid-_r_5e7_ .node circle,#chatgpt-mermaid-_r_5e7_ .node ellipse,#chatgpt-mermaid-_r_5e7_ .node polygon,#chatgpt-mermaid-_r_5e7_ .node path{fill:rgb(222, 234, 251);stroke:rgb(83, 154, 248);stroke-width:1px;}#chatgpt-mermaid-_r_5e7_ .rough-node .label text,#chatgpt-mermaid-_r_5e7_ .node .label text,#chatgpt-mermaid-_r_5e7_ .image-shape .label,#chatgpt-mermaid-_r_5e7_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-_r_5e7_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-_r_5e7_ .rough-node .label,#chatgpt-mermaid-_r_5e7_ .node .label,#chatgpt-mermaid-_r_5e7_ .image-shape .label,#chatgpt-mermaid-_r_5e7_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-_r_5e7_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-_r_5e7_ .root .anchor path{fill:rgb(143, 143, 143)!important;stroke-width:0;stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_5e7_ .arrowheadPath{fill:rgb(143, 143, 143);}#chatgpt-mermaid-_r_5e7_ .edgePath .path{stroke:rgb(143, 143, 143);stroke-width:1px;}#chatgpt-mermaid-_r_5e7_ .flowchart-link{stroke:rgb(143, 143, 143);fill:none;}#chatgpt-mermaid-_r_5e7_ .edgeLabel{background-color:rgb(252, 252, 252);text-align:center;}#chatgpt-mermaid-_r_5e7_ .edgeLabel p{background-color:rgb(252, 252, 252);}#chatgpt-mermaid-_r_5e7_ .edgeLabel rect{opacity:0.5;background-color:rgb(252, 252, 252);fill:rgb(252, 252, 252);}#chatgpt-mermaid-_r_5e7_ .labelBkg{background-color:rgba(252, 252, 252, 0.5);}#chatgpt-mermaid-_r_5e7_ .cluster rect{fill:rgb(243, 243, 243);stroke:rgba(0, 0, 0, 0.1);stroke-width:1px;}#chatgpt-mermaid-_r_5e7_ .cluster text{fill:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5e7_ .cluster span{color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5e7_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;font-size:12px;background:rgb(243, 243, 243);border:1px solid rgba(0, 0, 0, 0.1);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-_r_5e7_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5e7_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-_r_5e7_ .icon-shape,#chatgpt-mermaid-_r_5e7_ .image-shape{background-color:rgb(252, 252, 252);text-align:center;}#chatgpt-mermaid-_r_5e7_ .icon-shape p,#chatgpt-mermaid-_r_5e7_ .image-shape p{background-color:rgb(252, 252, 252);padding:2px;}#chatgpt-mermaid-_r_5e7_ .icon-shape .label rect,#chatgpt-mermaid-_r_5e7_ .image-shape .label rect{opacity:0.5;background-color:rgb(252, 252, 252);fill:rgb(252, 252, 252);}#chatgpt-mermaid-_r_5e7_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-_r_5e7_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-_r_5e7_ .node .neo-node{stroke:rgb(83, 154, 248);}#chatgpt-mermaid-_r_5e7_ [data-look="neo"].node rect,#chatgpt-mermaid-_r_5e7_ [data-look="neo"].cluster rect,#chatgpt-mermaid-_r_5e7_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-_r_5e7_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_5e7_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-_r_5e7_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-_r_5e7_-gradient);stroke-width:1px;}#chatgpt-mermaid-_r_5e7_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_5e7_ [data-look="neo"].node .neo-line path{stroke:rgb(83, 154, 248);filter:none;}#chatgpt-mermaid-_r_5e7_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-_r_5e7_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_5e7_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-_r_5e7_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-_r_5e7_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_5e7_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-_r_5e7_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_5e7_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(0, 79, 153);}#chatgpt-mermaid-_r_5e7_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(0, 79, 153);}#chatgpt-mermaid-_r_5e7_ .node tspan[font-weight="normal"],#chatgpt-mermaid-_r_5e7_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-_r_5e7_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(245, 250, 255);stroke:rgb(206, 219, 229);stroke-width:1px;}#chatgpt-mermaid-_r_5e7_ .node rect,#chatgpt-mermaid-_r_5e7_ .node circle,#chatgpt-mermaid-_r_5e7_ .node ellipse,#chatgpt-mermaid-_r_5e7_ .node polygon,#chatgpt-mermaid-_r_5e7_ .node path{fill:rgb(229, 243, 255);stroke:rgba(0, 0, 0, 0.1);stroke-width:1px;}#chatgpt-mermaid-_r_5e7_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-_r_5e7_ .node.mermaid-decision .label-container{fill:rgb(245, 250, 255);stroke:rgb(206, 219, 229);stroke-dasharray:2px,2px;}#chatgpt-mermaid-_r_5e7_ .edgePaths .flowchart-link{stroke:rgb(143, 143, 143);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-_r_5e7_ .marker{fill:rgb(143, 143, 143);stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_5e7_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;}👤 Customer🛍️ Browse Products🛒 Add to Cart🧾 Checkout🔐 Authentication✅ Validate User💰 Read Current ProductPrices📦 Validate Stock🧮 Calculate Order Total📝 Create Order📉 Update Stock🗄️ MongoDB📦 Order Status👤 Customer Order History👨‍💼 Admin




🔐 Security Architecture
#chatgpt-mermaid-_r_5fq_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;font-size:16px;fill:rgb(13, 13, 13);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-_r_5fq_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_5fq_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_5fq_ .error-icon{fill:rgb(243, 243, 243);}#chatgpt-mermaid-_r_5fq_ .error-text{fill:rgb(13, 13, 13);stroke:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5fq_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-_r_5fq_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-_r_5fq_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-_r_5fq_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-_r_5fq_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-_r_5fq_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-_r_5fq_ .marker{fill:rgb(143, 143, 143);stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_5fq_ .marker.cross{stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_5fq_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;font-size:16px;}#chatgpt-mermaid-_r_5fq_ p{margin:0;}#chatgpt-mermaid-_r_5fq_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5fq_ .cluster-label text{fill:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5fq_ .cluster-label span{color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5fq_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-_r_5fq_ .label text,#chatgpt-mermaid-_r_5fq_ span{fill:rgb(13, 13, 13);color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5fq_ .node rect,#chatgpt-mermaid-_r_5fq_ .node circle,#chatgpt-mermaid-_r_5fq_ .node ellipse,#chatgpt-mermaid-_r_5fq_ .node polygon,#chatgpt-mermaid-_r_5fq_ .node path{fill:rgb(222, 234, 251);stroke:rgb(83, 154, 248);stroke-width:1px;}#chatgpt-mermaid-_r_5fq_ .rough-node .label text,#chatgpt-mermaid-_r_5fq_ .node .label text,#chatgpt-mermaid-_r_5fq_ .image-shape .label,#chatgpt-mermaid-_r_5fq_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-_r_5fq_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-_r_5fq_ .rough-node .label,#chatgpt-mermaid-_r_5fq_ .node .label,#chatgpt-mermaid-_r_5fq_ .image-shape .label,#chatgpt-mermaid-_r_5fq_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-_r_5fq_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-_r_5fq_ .root .anchor path{fill:rgb(143, 143, 143)!important;stroke-width:0;stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_5fq_ .arrowheadPath{fill:rgb(143, 143, 143);}#chatgpt-mermaid-_r_5fq_ .edgePath .path{stroke:rgb(143, 143, 143);stroke-width:1px;}#chatgpt-mermaid-_r_5fq_ .flowchart-link{stroke:rgb(143, 143, 143);fill:none;}#chatgpt-mermaid-_r_5fq_ .edgeLabel{background-color:rgb(252, 252, 252);text-align:center;}#chatgpt-mermaid-_r_5fq_ .edgeLabel p{background-color:rgb(252, 252, 252);}#chatgpt-mermaid-_r_5fq_ .edgeLabel rect{opacity:0.5;background-color:rgb(252, 252, 252);fill:rgb(252, 252, 252);}#chatgpt-mermaid-_r_5fq_ .labelBkg{background-color:rgba(252, 252, 252, 0.5);}#chatgpt-mermaid-_r_5fq_ .cluster rect{fill:rgb(243, 243, 243);stroke:rgba(0, 0, 0, 0.1);stroke-width:1px;}#chatgpt-mermaid-_r_5fq_ .cluster text{fill:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5fq_ .cluster span{color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5fq_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;font-size:12px;background:rgb(243, 243, 243);border:1px solid rgba(0, 0, 0, 0.1);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-_r_5fq_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(13, 13, 13);}#chatgpt-mermaid-_r_5fq_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-_r_5fq_ .icon-shape,#chatgpt-mermaid-_r_5fq_ .image-shape{background-color:rgb(252, 252, 252);text-align:center;}#chatgpt-mermaid-_r_5fq_ .icon-shape p,#chatgpt-mermaid-_r_5fq_ .image-shape p{background-color:rgb(252, 252, 252);padding:2px;}#chatgpt-mermaid-_r_5fq_ .icon-shape .label rect,#chatgpt-mermaid-_r_5fq_ .image-shape .label rect{opacity:0.5;background-color:rgb(252, 252, 252);fill:rgb(252, 252, 252);}#chatgpt-mermaid-_r_5fq_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-_r_5fq_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-_r_5fq_ .node .neo-node{stroke:rgb(83, 154, 248);}#chatgpt-mermaid-_r_5fq_ [data-look="neo"].node rect,#chatgpt-mermaid-_r_5fq_ [data-look="neo"].cluster rect,#chatgpt-mermaid-_r_5fq_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-_r_5fq_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_5fq_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-_r_5fq_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-_r_5fq_-gradient);stroke-width:1px;}#chatgpt-mermaid-_r_5fq_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_5fq_ [data-look="neo"].node .neo-line path{stroke:rgb(83, 154, 248);filter:none;}#chatgpt-mermaid-_r_5fq_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-_r_5fq_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_5fq_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-_r_5fq_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-_r_5fq_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_5fq_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-_r_5fq_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_5fq_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(0, 79, 153);}#chatgpt-mermaid-_r_5fq_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(0, 79, 153);}#chatgpt-mermaid-_r_5fq_ .node tspan[font-weight="normal"],#chatgpt-mermaid-_r_5fq_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-_r_5fq_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(245, 250, 255);stroke:rgb(206, 219, 229);stroke-width:1px;}#chatgpt-mermaid-_r_5fq_ .node rect,#chatgpt-mermaid-_r_5fq_ .node circle,#chatgpt-mermaid-_r_5fq_ .node ellipse,#chatgpt-mermaid-_r_5fq_ .node polygon,#chatgpt-mermaid-_r_5fq_ .node path{fill:rgb(229, 243, 255);stroke:rgba(0, 0, 0, 0.1);stroke-width:1px;}#chatgpt-mermaid-_r_5fq_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-_r_5fq_ .node.mermaid-decision .label-container{fill:rgb(245, 250, 255);stroke:rgb(206, 219, 229);stroke-dasharray:2px,2px;}#chatgpt-mermaid-_r_5fq_ .edgePaths .flowchart-link{stroke:rgb(143, 143, 143);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-_r_5fq_ .marker{fill:rgb(143, 143, 143);stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_5fq_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;}🌐 Client Request🌍 CORS Validation🚦 Rate Limiting🪖 Helmet🍪 HTTP-only Cookie🔐 JWT Authentication🛡️ CSRF Validation👮 RBAC✅ Request Validation🎯 Controller🗄️ MongoDB📤 Secure Response




📁 Project Structure
NexoraCart/
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── orderController.js
│   │   │   └── productController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── error.js
│   │   │   └── security.js
│   │   │
│   │   ├── models/
│   │   │   ├── Order.js
│   │   │   ├── Product.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   ├── orders.js
│   │   │   └── products.js
│   │   │
│   │   ├── utils/
│   │   │   ├── csrf.js
│   │   │   └── jwt.js
│   │   │
│   │   └── seed.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   └── ProductCard.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Admin.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Product.jsx
│   │   │   └── SimplePages.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

📊 Product Catalog
NexoraCart includes a seeded catalog containing 60 products across 6 categories.
Categories
- 💻 Electronics
- 👕 Fashion
- 🏠 Home & Kitchen
- 💄 Beauty & Personal Care
- 🏋️ Sports & Fitness
- 📚 Books & Stationery
The seed system generates realistic product information including:
- Product name
- Slug
- Description
- Category
- Price
- Original price
- Discount
- Rating
- Review count
- Stock
- Product images
- Featured status
- Timestamps
🔒 Account & Data Isolation
NexoraCart strictly separates customer data between accounts.

Each customer can access only their own:
- 🛒 Cart
- ❤️ Wishlist
- 📦 Orders
- 👤 Profile
- ⚙️ Account settings
The backend also enforces ownership checks for protected resources.

Administrative access is handled separately through backend-enforced role authorization.
🛡️ Security
NexoraCart implements multiple layers of application security:
- JWT authentication
- HTTP-only authentication cookies
- bcrypt password hashing
- CSRF protection
- Role-based access control
- Backend authorization
- CORS allow-list
- Helmet security headers
- API rate limiting
- Request body size limits
- Request validation
- MongoDB-safe queries
- ObjectId validation
- Environment-based secrets
- Server-side product price validation
- Server-side stock validation
- Customer-specific order authorization
- Admin-only protected endpoints
Order Security
Order totals are never trusted directly from the frontend.

During checkout, the backend:
1. Reads the current product data from MongoDB.
2. Validates product availability.
3. Validates stock.
4. Calculates the order total server-side.
5. Creates the order.
6. Updates inventory.
This prevents clients from manipulating product prices or submitting invalid order totals.
🧪 Testing & Verification
The application has been locally tested for:
- Authentication
- Registration
- Login/logout
- Customer account isolation
- Cart isolation
- Wishlist isolation
- Order isolation
- Admin/customer separation
- Product management
- Order management
- Search
- Category navigation
- Product details
- Checkout
- Stock handling
- Production build
Backend
npm install
npm audit
npm start

Expected result:
MongoDB connected
NexoraCart API listening on port 5000

Frontend
npm install
npm audit
npm run build
npm run dev

The production build should complete successfully using Vite.
📦 Project Setup
✅ Prerequisites
Make sure the following are installed:
- Node.js 18.18 or higher
- npm
- Git
- MongoDB / MongoDB Atlas
🗄️ 1. Database Configuration
NexoraCart supports MongoDB Atlas or another managed MongoDB deployment.

Create a .env file inside the backend directory:
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_random_jwt_secret

CLIENT_URL=http://localhost:5173

TRUST_PROXY=0

For production, use a strong randomly generated JWT secret.
⚠️ Never commit your production .env file to GitHub.

⚙️ 2. Backend Setup
Open a terminal:
cd backend
npm install

Create your environment file:
copy .env.example .env

Configure the required environment variables.
Seed the database
npm run seed

The seed script creates:
- Admin account
- 60 products
- 6 product categories
The seed process does not run automatically when the server starts.
Start the backend
Development:
npm run dev

Production-style local start:
npm start

The backend runs by default on:
http://localhost:5000

API base:
http://localhost:5000/api

🎨 3. Frontend Setup
Open another terminal:
cd frontend
npm install

Create the environment file:
copy .env.example .env

Configure:
VITE_API_URL=http://localhost:5000/api

Start the development server:
npm run dev

The Vite development server runs on:
http://localhost:5173

🚀 4. Running the Application
Once both servers are running:
1. Open http://localhost:5173
2. Create a customer account.
3. Login.
4. Browse products.
5. Search or select categories.
6. Add products to the cart.
7. Add products to the wishlist.
8. Continue to checkout.
9. Place an order.
10. Open the Orders section.
11. Login as an administrator to manage products and customer orders.
👨‍💼 Admin Access
The administrator account is configured through environment variables used by the seed process.

Example:
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

Never publish administrator credentials in the repository.

The admin dashboard provides administrative capabilities such as:
- Product management
- Product creation
- Product editing
- Product deletion
- Customer order management
- Order status updates
Admin permissions are enforced on the backend and should never rely only on frontend route protection.
🌍 Production Deployment
NexoraCart is structured for separate frontend and backend deployment.
Backend
Recommended configuration:
Root Directory: backend
Build Command: npm install
Start Command: npm start

Production environment variables include:
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=your_frontend_url
TRUST_PROXY=1
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

Frontend
Recommended configuration:
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist

Frontend environment:
VITE_API_URL=your_backend_api_url

Production secrets must be configured through the hosting provider's environment variable system and must never be committed to GitHub.

📈 Scalability Considerations
The application is structured with future scalability in mind.

Potential production improvements include:
- Redis caching
- Background job processing
- External object storage
- CDN-based product media
- Structured application logging
- Monitoring and alerting
- API versioning
- Payment gateway integration
- Audit logging
- Database query optimization
- Additional database indexes
- Horizontal backend scaling
These components can be introduced without changing the core frontend/backend separation.
🧩 Core API Areas
The backend provides dedicated API areas for:
Area	Purpose
Authentication	Registration, login, logout and user authentication
Products	Product discovery and product management
Orders	Customer order creation and order retrieval
Admin	Administrative product and order operations
Health	API/service health verification


🧠 Engineering Highlights
NexoraCart focuses on practical full-stack engineering principles rather than only UI implementation.
Frontend
- Component-based React architecture
- Centralized application state
- Route-based page organization
- Responsive CSS architecture
- Reusable product components
- API service abstraction
Backend
- Modular route/controller/model structure
- Middleware-based security
- Authentication and authorization separation
- Centralized error handling
- Server-side validation
- Database-backed business logic
Database
- Mongoose schemas
- User-specific data ownership
- Product inventory management
- Order persistence
- Server-side order calculations
🌟 Why NexoraCart?
NexoraCart brings the essential components of a modern e-commerce platform into a single full-stack application:
        🛍️ Product Discovery
                 +
        🔎 Search & Categories
                 +
        🛒 Shopping Cart
                 +
        ❤️ Wishlist
                 +
        🔐 Secure Authentication
                 +
        📦 Order Management
                 +
        👨‍💼 Admin Dashboard
                 ↓
          🚀 NexoraCart

The project demonstrates how a modern MERN application can combine responsive UI development, REST APIs, authentication, authorization, database design, security practices, and e-commerce business logic into one cohesive platform.
🧰 Built With
React • Vite • JavaScript • React Router • Context API • CSS • Node.js • Express.js • MongoDB • Mongoose • JWT • bcryptjs • Helmet • CORS
📌 Project Status
Status: Production-ready project structure

The application has been locally tested across its primary customer and administrative workflows and has successfully passed production-build and dependency-audit checks.
👨‍💻 Author
Manjeet Prabhakar Rawat

GitHub:
https://github.com/ManjeetPrabhakarRawat
⭐ Support
If you find NexoraCart useful or interesting, consider giving the repository a ⭐ on GitHub.
🚀 Built with the MERN Stack
NexoraCart — Shop smarter. Live better.

### एक important बात

Maine architecture ko exactly **`flowchart LR`** style mein rakha hai, jaise tumhari Nexivora README mein hai. :chatgpt-content-reference{index="1"}

Aur maine **Live Demo ko abhi `Coming Soon`** rakha hai, kyunki backend/frontend Render deployment abhi complete nahi hua hai. Deployment ke baad hum usko actual URLs se replace kar denge.

**Is README ko `NexoraCart/README.md` mein replace kar sakte ho.**