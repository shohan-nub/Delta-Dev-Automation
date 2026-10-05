import Link from "next/link";
import type { Metadata } from "next";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "Studio | Business Management Platform",
  description:
    "Run your business from one powerful workspace. Manage products, inventory, orders, customers, knowledge and automation with Studio.",
};

const modules = [
  {
    icon: "box",
    number: "01",
    title: "Products",
    description: "Manage your entire product catalog from one place.",
  },
  {
    icon: "layers",
    number: "02",
    title: "Inventory",
    description: "Keep stock information organized and up to date.",
  },
  {
    icon: "cart",
    number: "03",
    title: "Orders",
    description: "Track orders from pending to completed.",
  },
  {
    icon: "users",
    number: "04",
    title: "Customers",
    description: "Understand and manage your customer base.",
  },
  {
    icon: "book",
    number: "05",
    title: "Knowledge",
    description: "Organize business knowledge and information.",
  },
  {
    icon: "spark",
    number: "06",
    title: "AI & Automation",
    description: "Connect intelligent automation to everyday workflows.",
  },
] as const;

function Icon({
  name,
  size = 20,
}: {
  name: (typeof modules)[number]["icon"] | "arrow" | "search" | "bell" | "chevron" | "plus" | "more" | "check";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "box":
      return <svg {...common}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.3 7.7 7.7 4.4 7.7-4.4M12 21v-8.9" /></svg>;
    case "layers":
      return <svg {...common}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>;
    case "cart":
      return <svg {...common}><path d="M3 4h2l2.1 11.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L21 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>;
    case "users":
      return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>;
    case "book":
      return <svg {...common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" /><path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20M8 7h7M8 10h5" /></svg>;
    case "spark":
      return <svg {...common}><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14ZM5 14l.6 1.4L7 16l-1.4.6L5 18l-.6-1.4L3 16l1.4-.6L5 14Z" /></svg>;
    case "arrow":
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "search":
      return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>;
    case "bell":
      return <svg {...common}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>;
    case "chevron":
      return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "more":
      return <svg {...common}><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></svg>;
    case "check":
      return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
  }
}

function BrandMark() {
  return (
    <span className={styles.brandMark} aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}

function DashboardPreview() {
  return (
    <div className={styles.previewStage} aria-label="Preview of the Studio business dashboard">
      <div className={styles.previewGlow} />
      <div className={styles.previewFrame}>
        <aside className={styles.previewSidebar}>
          <div className={styles.previewBrand}><BrandMark /><b>Studio</b></div>
          <span className={styles.sidebarCaption}>WORKSPACE</span>
          <div className={`${styles.sidebarItem} ${styles.sidebarActive}`}><span className={styles.navGlyph}>▦</span>Overview</div>
          <div className={styles.sidebarItem}><Icon name="box" size={15} />Products</div>
          <div className={styles.sidebarItem}><Icon name="layers" size={15} />Inventory</div>
          <div className={styles.sidebarItem}><Icon name="cart" size={15} />Orders <i className={styles.navCount}>8</i></div>
          <div className={styles.sidebarItem}><Icon name="users" size={15} />Customers</div>
          <div className={styles.sidebarItem}><Icon name="book" size={15} />Knowledge</div>
          <div className={styles.sidebarBottom}><span className={styles.avatar}>JD</span><span><b>Jordan Davis</b><small>Workspace admin</small></span><Icon name="more" size={15} /></div>
        </aside>
        <div className={styles.previewMain}>
          <div className={styles.previewTopbar}>
            <div className={styles.breadcrumb}>Workspace <span>/</span> Overview</div>
            <div className={styles.previewTools}><span className={styles.previewSearch}><Icon name="search" size={14} /> Search</span><Icon name="bell" size={16} /><span className={styles.avatarSmall}>JD</span></div>
          </div>
          <div className={styles.previewContent}>
            <div className={styles.previewHeading}><div><span className={styles.liveLabel}><i /> LIVE OVERVIEW</span><h2>Good morning, Jordan</h2><p>Here’s what’s happening with your business today.</p></div><button type="button" className={styles.dateButton}>Last 30 days <Icon name="chevron" size={13} /></button></div>
            <div className={styles.statGrid}>
              <div className={styles.statCard}><div className={styles.statLabel}>Total revenue <span>↗</span></div><strong>$48,294</strong><small><b>↑ 12.8%</b> <em>vs. last month</em></small><div className={styles.miniBars}><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
              <div className={styles.statCard}><div className={styles.statLabel}>Orders <span>↗</span></div><strong>1,284</strong><small><b>↑ 8.2%</b> <em>vs. last month</em></small><div className={styles.sparkline}><svg viewBox="0 0 140 32" preserveAspectRatio="none"><path d="M1 26 15 21 29 24 43 13 57 18 71 10 85 15 99 5 113 11 127 3 139 6" /></svg></div></div>
              <div className={styles.statCard}><div className={styles.statLabel}>Active products <span>↗</span></div><strong>356</strong><small><b>+ 18</b> <em>added this month</em></small><div className={styles.productDots}><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
              <div className={styles.statCard}><div className={styles.statLabel}>Customers <span>↗</span></div><strong>2,401</strong><small><b>↑ 6.4%</b> <em>vs. last month</em></small><div className={styles.customerAvatars}><i>AL</i><i>MK</i><i>TS</i><i>+</i><span>+42 this week</span></div></div>
            </div>
            <div className={styles.previewLower}>
              <div className={styles.chartCard}><div className={styles.cardHeading}><div><b>Business performance</b><small>Revenue over time</small></div><span className={styles.chartLegend}><i /> Revenue</span></div><div className={styles.chartArea}><div className={styles.chartY}><span>$12k</span><span>$8k</span><span>$4k</span><span>$0</span></div><svg viewBox="0 0 600 150" preserveAspectRatio="none" className={styles.chartSvg}><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8b2d3a" stopOpacity=".24" /><stop offset="100%" stopColor="#8b2d3a" stopOpacity="0" /></linearGradient></defs><path className={styles.chartFill} d="M0 122 C30 110 44 116 70 99 S115 102 140 82 S182 90 210 72 S248 77 275 62 S318 72 345 47 S385 58 414 40 S457 48 483 26 S525 43 550 19 S584 24 600 10 V150 H0Z" /><path className={styles.chartLine} d="M0 122 C30 110 44 116 70 99 S115 102 140 82 S182 90 210 72 S248 77 275 62 S318 72 345 47 S385 58 414 40 S457 48 483 26 S525 43 550 19 S584 24 600 10" /></svg></div><div className={styles.chartX}><span>May 01</span><span>May 06</span><span>May 11</span><span>May 16</span><span>May 21</span><span>May 26</span><span>May 31</span></div></div>
              <div className={styles.ordersCard}><div className={styles.cardHeading}><div><b>Recent orders</b><small>Latest activity</small></div><span className={styles.viewAll}>View all <Icon name="arrow" size={12} /></span></div><div className={styles.orderRow}><span className={styles.orderIcon}>#</span><span><b>#ST-2841</b><small>Olivia Rhye</small></span><strong>$240.00</strong><i className={styles.orderStatus}>Paid</i></div><div className={styles.orderRow}><span className={styles.orderIcon}>#</span><span><b>#ST-2840</b><small>Phoenix Baker</small></span><strong>$128.50</strong><i className={`${styles.orderStatus} ${styles.orderPending}`}>Pending</i></div><div className={styles.orderRow}><span className={styles.orderIcon}>#</span><span><b>#ST-2839</b><small>Lana Steiner</small></span><strong>$86.00</strong><i className={styles.orderStatus}>Paid</i></div></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.floatInventory}><span className={styles.floatIcon}><Icon name="layers" size={16} /></span><span><small>Inventory health</small><b>All systems stocked</b></span><i className={styles.healthDot} /></div>
      <div className={styles.floatAutomation}><span className={styles.floatIcon}><Icon name="spark" size={16} /></span><span><small>Automation</small><b>Order flow active</b></span><span className={styles.flowPulse} /></div>
      <div className={styles.sceneOrder} aria-hidden="true"><span>ORDER / 2841</span><b>Ready to ship</b><i /></div>
      <div className={styles.sceneCatalog} aria-hidden="true"><span>CATALOG</span><b>356</b><small>active products</small></div>
      <div className={styles.sceneKnowledge} aria-hidden="true"><i /><span>KNOWLEDGE</span><b>Up to date</b></div>
      <div className={styles.sceneCustomers} aria-hidden="true"><b>+42</b><span>customer activity <i /> this week</span></div>
    </div>
  );
}

function ManagementPreviews() {
  return (
    <div className={styles.managementGrid}>
      <article className={`${styles.managementCard} ${styles.productPanel}`}>
        <div className={styles.mockHeader}><div><span className={styles.mockEyebrow}>CATALOG</span><h3>Product management</h3></div><button type="button" className={styles.mockAction}><Icon name="plus" size={13} /> Add product</button></div>
        <div className={styles.mockControls}><span className={styles.mockSearch}><Icon name="search" size={13} /> Search products</span><span className={styles.filterButton}>Category <Icon name="chevron" size={11} /></span></div>
        <div className={styles.productTable}>
          <div className={styles.tableHead}><span>PRODUCT</span><span>SKU</span><span>STOCK</span><span>STATUS</span></div>
          <div className={styles.tableRow}><i className={styles.productSwatch} /><b>Canvas Weekender</b><span>CAN-028</span><strong>124</strong><i className={styles.tableStatus}>In stock</i></div>
          <div className={styles.tableRow}><i className={`${styles.productSwatch} ${styles.swatchBlue}`} /><b>Everyday Carry</b><span>EDC-014</span><strong>08</strong><i className={`${styles.tableStatus} ${styles.statusLow}`}>Low stock</i></div>
          <div className={styles.tableRow}><i className={`${styles.productSwatch} ${styles.swatchGreen}`} /><b>Field Notes Set</b><span>FNS-006</span><strong>86</strong><i className={styles.tableStatus}>In stock</i></div>
        </div>
        <div className={styles.mockFoot}><span>Showing 3 of 356 products</span><span>← &nbsp; 1 &nbsp; 2 &nbsp; 3 &nbsp; →</span></div>
      </article>
      <article className={`${styles.managementCard} ${styles.orderPanel}`}>
        <div className={styles.mockHeader}><div><span className={styles.mockEyebrow}>FULFILLMENT</span><h3>Order management</h3></div><button type="button" className={styles.iconButton}><Icon name="more" size={17} /></button></div>
        <div className={styles.orderSummary}><div><span>Open orders</span><b>28</b></div><div><span>To fulfill</span><b>12</b></div><div><span>Completed</span><b>194</b></div></div>
        <div className={styles.fulfillment}><div className={styles.fulfillmentTop}><span className={styles.packageGlyph}><Icon name="cart" size={15} /></span><span><b>Order #ST-2841</b><small>Placed today · Olivia Rhye</small></span><i className={styles.fulfillmentTag}>Ready to ship</i></div><div className={styles.progressTrack}><i /></div><div className={styles.progressLabels}><span>Confirmed</span><span>Processing</span><b>Fulfillment</b></div></div>
        <div className={styles.fulfillmentSecondary}><span className={styles.smallOrderGlyph}>#</span><span><b>#ST-2840</b><small>Yesterday · Phoenix Baker</small></span><i className={styles.processingTag}>Processing</i></div>
      </article>
      <article className={`${styles.managementCard} ${styles.customerPanel}`}>
        <div className={styles.mockHeader}><div><span className={styles.mockEyebrow}>RELATIONSHIPS</span><h3>Customer management</h3></div><span className={styles.customerTotal}>2,401 total <Icon name="arrow" size={12} /></span></div>
        <div className={styles.customerChart}><div className={styles.customerStat}><b>+12.6%</b><span>new customers this month</span><small>↑ 4.2% from last month</small></div><div className={styles.customerBars}><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
        <div className={styles.customerList}><div className={styles.customerListHead}>RECENT CUSTOMERS <span>View all →</span></div><div><i className={`${styles.personAvatar} ${styles.avatarLilac}`}>OR</i><span><b>Olivia Rhye</b><small>olivia.r@example.com</small></span><strong>12 orders</strong></div><div><i className={`${styles.personAvatar} ${styles.avatarSand}`}>PB</i><span><b>Phoenix Baker</b><small>phoenix.b@example.com</small></span><strong>8 orders</strong></div></div>
      </article>
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.site}>
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand} aria-label="Studio home"><BrandMark /><span>Studio</span></Link>
          <nav className={styles.navLinks} aria-label="Main navigation">
            <Link href="/">Home</Link>
            <a href="#platform">Platform</a>
            <a href="#features">Capabilities</a>
          </nav>
          <div className={styles.navActions}><Link href="/admin" className={styles.dashboardLink}>Dashboard</Link><Link href="/admin" className={styles.navCta}>Open Dashboard <Icon name="arrow" size={15} /></Link></div>
        </div>
      </header>

      <section className={styles.hero} id="platform">
        <div className={styles.heroBackdrop} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={`${styles.eyebrow} ${styles.heroEyebrow}`}><span className={styles.eyebrowLine} /> BUSINESS OPERATING SYSTEM</div>
            <h1>Everything your<br />business needs.<br /><span>In one place.</span></h1>
            <p className={styles.heroLead}>Manage products, inventory, orders, customers and knowledge — all from one intelligent management system.</p>
            <div className={styles.heroActions}><Link href="/admin" className={styles.primaryButton}>Open Dashboard <Icon name="arrow" size={17} /></Link><a href="#features" className={styles.secondaryButton}>Explore Platform <span>↓</span></a></div>
            <div className={styles.trustLine}><span className={styles.trustCheck}><Icon name="check" size={12} /></span> Built for modern commerce operations <i /> <span>One workspace. Every moving part.</span></div>
          </div>
          <DashboardPreview />
        </div>
        <div className={styles.heroFoot}><span>01 / 07</span><i /><span>THE OPERATING LAYER FOR YOUR BUSINESS</span><span className={styles.heroFootRight}>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <section className={styles.featuresSection} id="features">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <div><div className={styles.eyebrow}><span className={styles.eyebrowLine} /> ONE CONNECTED PLATFORM</div><h2>Everything your<br /><span>operation needs.</span></h2></div>
            <p>Bring your essential business operations into one centralized workspace. Clear visibility, less context switching, and more room to move your business forward.</p>
          </div>
          <div className={styles.featureGrid}>
            {modules.map((module) => (
              <a className={styles.featureItem} href="#solutions" key={module.title}>
                <div className={styles.featureTop}><span className={styles.featureIcon}><Icon name={module.icon} size={20} /></span><span className={styles.featureNumber}>{module.number}</span></div>
                <h3>{module.title}</h3><p>{module.description}</p><span className={styles.featureArrow}><Icon name="arrow" size={15} /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.architectureSection} id="solutions">
        <div className={styles.sectionInner}>
          <div className={styles.architectureIntro}><div className={styles.eyebrow}><span className={styles.eyebrowLine} /> BUILT TO WORK TOGETHER</div><h2>One system.<br /><span>Every connection.</span></h2><p>When the pieces work together, the whole business moves better. Studio brings your essential workflows into a shared operational core.</p></div>
          <div className={styles.architecture} aria-label="Products, inventory, orders, customers, knowledge and AI automation connected to the business workspace">
            <svg className={styles.connectionSvg} viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden="true"><path d="M170 85 C250 85 285 150 415 202" /><path d="M170 230 C270 230 330 230 415 230" /><path d="M170 375 C260 375 310 310 415 258" /><path d="M830 85 C750 85 715 150 585 202" /><path d="M830 230 C730 230 670 230 585 230" /><path d="M830 375 C740 375 690 310 585 258" /><path className={styles.connectionPulse} d="M170 230 C270 230 330 230 415 230" /></svg>
            <div className={`${styles.archNode} ${styles.nodeProducts}`}><span className={styles.nodeIcon}><Icon name="box" size={17} /></span><span><b>Products</b><small>Catalog</small></span></div>
            <div className={`${styles.archNode} ${styles.nodeInventory}`}><span className={styles.nodeIcon}><Icon name="layers" size={17} /></span><span><b>Inventory</b><small>Stock control</small></span></div>
            <div className={`${styles.archNode} ${styles.nodeOrders}`}><span className={styles.nodeIcon}><Icon name="cart" size={17} /></span><span><b>Orders</b><small>Fulfillment</small></span></div>
            <div className={styles.workspaceCore}><span className={styles.coreOrbit}><i /><i /><i /></span><span className={styles.coreMark}><BrandMark /></span><span className={styles.coreLabel}>BUSINESS WORKSPACE</span><b>Studio</b><small>One source of clarity</small></div>
            <div className={`${styles.archNode} ${styles.nodeCustomers}`}><span className={styles.nodeIcon}><Icon name="users" size={17} /></span><span><b>Customers</b><small>Relationships</small></span></div>
            <div className={`${styles.archNode} ${styles.nodeKnowledge}`}><span className={styles.nodeIcon}><Icon name="book" size={17} /></span><span><b>Knowledge</b><small>Business context</small></span></div>
            <div className={`${styles.archNode} ${styles.nodeAi}`}><span className={styles.nodeIcon}><Icon name="spark" size={17} /></span><span><b>AI Automation</b><small>Intelligent workflows</small></span></div>
            <div className={styles.archBottom}><i /> Connected by design <span>·</span> Ready to scale</div>
          </div>
          <div className={styles.mobileArchitecture} aria-hidden="true"><div className={styles.mobileCore}><BrandMark /> BUSINESS WORKSPACE <b>Studio</b></div><div className={styles.mobileModuleGrid}>{modules.map((module) => <span key={module.title}><Icon name={module.icon} size={15} />{module.title}</span>)}</div></div>
        </div>
      </section>

      <section className={styles.managementSection}>
        <div className={styles.sectionInner}>
          <div className={styles.managementIntro}><div><div className={styles.eyebrow}><span className={styles.eyebrowLine} /> A CLEARER WAY TO OPERATE</div><h2>Built for the work<br />behind the business.</h2></div><p>Purposeful tools for the decisions and details that keep your operation moving.</p></div>
          <ManagementPreviews />
        </div>
      </section>

      <section className={styles.intelligenceSection}>
        <div className={styles.intelligenceGrid}>
          <div className={styles.intelligenceCopy}><div className={styles.eyebrow}><span className={styles.eyebrowLine} /> THE INTELLIGENCE LAYER</div><h2>From management<br />to intelligent <span>automation.</span></h2><p>Connect your business data with AI-powered workflows and automation. Give every interaction the context it needs, and your team more time for what matters.</p><Link href="/admin" className={styles.textLink}>Explore your workspace <Icon name="arrow" size={15} /></Link></div>
          <div className={styles.flowPanel}><div className={styles.flowHead}><span>STUDIO INTELLIGENCE</span><i><b /> SYSTEM ACTIVE</i></div><div className={styles.flowDiagram}><div className={`${styles.flowNode} ${styles.flowData}`}><span><Icon name="layers" size={17} /></span><b>Business Data</b><small>Products · orders · customers</small></div><div className={styles.flowConnector}><i /></div><div className={`${styles.flowNode} ${styles.flowKnowledge}`}><span><Icon name="book" size={17} /></span><b>Knowledge</b><small>Shared context, always ready</small></div><div className={styles.flowConnector}><i /></div><div className={`${styles.flowNode} ${styles.flowAi}`}><span><Icon name="spark" size={17} /></span><b>Intelligence</b><small>Insight in the loop</small></div><div className={styles.flowConnector}><i /></div><div className={`${styles.flowNode} ${styles.flowAuto}`}><span><Icon name="arrow" size={17} /></span><b>Automation</b><small>Less repetition, more momentum</small></div><div className={styles.flowConnector}><i /></div><div className={`${styles.flowNode} ${styles.flowCustomer}`}><span><Icon name="users" size={17} /></span><b>Action</b><small>Helpful, consistent, human</small></div></div><div className={styles.flowFoot}><span><i /> Workflow connection</span><span>01 — 05</span></div></div>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.stepsIntro}><div className={styles.eyebrow}><span className={styles.eyebrowLine} /> A SIMPLE WAY FORWARD</div><h2>Clarity at every<br /><span>stage of growth.</span></h2></div>
          <div className={styles.stepsGrid}>
            <article className={styles.step}><span className={styles.stepNumber}>01</span><div className={styles.stepRule}><i /></div><h3>Organize</h3><p>Manage products, inventory, customers and knowledge.</p><div className={styles.stepMicro}><span><Icon name="box" size={14} /> Products</span><span><Icon name="layers" size={14} /> Inventory</span><span><Icon name="book" size={14} /> Knowledge</span></div></article>
            <article className={styles.step}><span className={styles.stepNumber}>02</span><div className={styles.stepRule}><i /></div><h3>Operate</h3><p>Process and track orders from one workspace.</p><div className={styles.stepMicro}><span className={styles.stepOrder}><i /> #ST-2841</span><span className={styles.stepDone}><Icon name="check" size={12} /> Fulfilled</span></div></article>
            <article className={styles.step}><span className={styles.stepNumber}>03</span><div className={styles.stepRule}><i /></div><h3>Automate</h3><p>Connect AI and automation to reduce repetitive work.</p><div className={styles.stepMicro}><span className={styles.stepFlow}><Icon name="spark" size={13} /> Workflow live <i /></span></div></article>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.ctaGrid} aria-hidden="true" />
        <div className={styles.ctaOrb} aria-hidden="true" />
        <div className={styles.ctaContent}><span className={styles.ctaEyebrow}><i /> YOUR NEXT CHAPTER STARTS HERE</span><h2>Your business.<br /><span>One intelligent workspace.</span></h2><p>Bring your operations together and manage everything from one place.</p><Link href="/admin" className={styles.ctaButton}>Open Dashboard <Icon name="arrow" size={17} /></Link><span className={styles.ctaFoot}>ONE WORKSPACE <i /> EVERY OPERATION <i /> MORE ROOM TO GROW</span></div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerMain}><Link href="/" className={styles.brand}><BrandMark /><span>Studio</span></Link><p>Business Management Platform</p><nav aria-label="Footer navigation"><a href="#platform">Platform</a><a href="#features">Features</a><Link href="/admin">Dashboard <Icon name="arrow" size={13} /></Link></nav></div>
        <div className={styles.footerBottom}><span>© 2026 Studio. Built for the way business moves.</span><span><i /> BUSINESS MANAGEMENT PLATFORM</span></div>
      </footer>
    </main>
  );
}
