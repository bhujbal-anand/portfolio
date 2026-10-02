/**
 * Anand Bhujbal - Portfolio Interactive Scripts
 * Handles Dark/Light Mode, Navigation ScrollSpy, Animated Metrics,
 * Dashboard Tab Switcher, SQL Code Explorer, Modals, and Contact Form.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initMetricCounters();
  initSkillsFilter();
  initDashboardTabs();
  initSqlAnalyticsLab();
  initModals();
  initLightbox();
  initContactForm();
});

/* =====================================================================
   1. THEME TOGGLE (Light / Dark Theme)
   ===================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('anand_portfolio_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('anand_portfolio_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });
}

function updateThemeIcon(theme) {
  const iconContainer = document.getElementById('theme-toggle-icon');
  if (!iconContainer) return;
  
  if (theme === 'dark') {
    iconContainer.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="1" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
    iconContainer.setAttribute('title', 'Switch to Light Mode');
  } else {
    iconContainer.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    iconContainer.setAttribute('title', 'Switch to Dark Mode');
  }
}

/* =====================================================================
   2. NAVIGATION & SCROLLSPY
   ===================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  // Mobile menu toggle
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
      });
    });
  }

  // ScrollSpy Active Link Tracking
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* =====================================================================
   3. ANIMATED METRICS COUNTERS
   ===================================================================== */
function initMetricCounters() {
  const counterElements = document.querySelectorAll('.metric-counter');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counterElements.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
          const duration = 1800; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeOutProgress;

            if (decimals > 0) {
              counter.textContent = prefix + currentVal.toFixed(decimals) + suffix;
            } else {
              counter.textContent = prefix + Math.floor(currentVal).toLocaleString() + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              if (decimals > 0) {
                counter.textContent = prefix + target.toFixed(decimals) + suffix;
              } else {
                counter.textContent = prefix + target.toLocaleString() + suffix;
              }
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* =====================================================================
   3.5 SKILLS FILTER
   ===================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter-nav .filter-btn');
  const cards = document.querySelectorAll('.skills-grid .skill-category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* =====================================================================
   4. DASHBOARD TAB SWITCHER (EstateWise Multi-Page Power BI)
   ===================================================================== */
function initDashboardTabs() {
  const tabButtons = document.querySelectorAll('.dash-tab-btn');
  const screenImages = document.querySelectorAll('.dashboard-screen-img');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.id === 'dash-tab-add-btn') {
        showToast('Next dashboard view in progress! Propose metrics below.');
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      const targetTab = button.getAttribute('data-tab');

      // Update button state
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update image
      screenImages.forEach(img => {
        if (img.getAttribute('data-screen') === targetTab) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    });
  });
}

/* =====================================================================
   5. SQL ANALYTICS LAB & QUERY EXPLORER
   ===================================================================== */
const SQL_QUERIES_DATA = [
  {
    id: 'q18-top-agent-city',
    category: 'advanced',
    tag: 'Window Function & CTE',
    title: 'Top-Performing Agent by City (ROW_NUMBER & CTE)',
    description: 'Finds the single highest-grossing agent across every city by total sales volume using a partitioned window function.',
    code: `-- Using a CTE and ROW_NUMBER(), find the top-performing agent
-- (by total sale value) in each city
WITH top_performer_by_city AS (
    SELECT 
        b.agent_name,
        p.city,
        SUM(b.sale_price) AS total_sale
    FROM property_bookings b
    INNER JOIN properties p ON p.property_id = b.property_id
    GROUP BY b.agent_name, p.city
),
ranking_agents AS (
    SELECT 
        agent_name,
        city,
        total_sale,
        ROW_NUMBER() OVER(
            PARTITION BY city 
            ORDER BY total_sale DESC
        ) AS rrank_number
    FROM top_performer_by_city
)
SELECT 
    agent_name,
    city,
    total_sale
FROM ranking_agents
WHERE rrank_number = 1
ORDER BY total_sale DESC;`
  },
  {
    id: 'q21-yoy-growth-lag',
    category: 'advanced',
    tag: 'Window Function: LAG()',
    title: 'Year-over-Year (YoY) Sales Growth % by City',
    description: 'Computes annual city-level revenue delta and YoY growth percentage utilizing MySQL LAG() over partitioned windows.',
    code: `-- Calculate year-over-year (YoY) growth percentage in total sale value
-- for each city using LAG()
WITH yearly_city_sales AS (
    SELECT 
        p.city,
        YEAR(b.booking_date) AS sales_year,
        SUM(b.sale_price) AS current_year_sales
    FROM properties p 
    INNER JOIN property_bookings b ON p.property_id = b.property_id
    GROUP BY p.city, YEAR(b.booking_date)
),
sales_with_previous_year AS (
    SELECT 
        city,
        sales_year,
        current_year_sales,
        LAG(current_year_sales) OVER(
            PARTITION BY city 
            ORDER BY sales_year
        ) AS previous_year_sales
    FROM yearly_city_sales
)
SELECT 
    city,
    sales_year,
    current_year_sales,
    previous_year_sales,
    ROUND(
        (current_year_sales - previous_year_sales) * 100.0 / previous_year_sales, 
        2
    ) AS Growth_pct
FROM sales_with_previous_year
ORDER BY city, sales_year;`
  },
  {
    id: 'q19-cumulative-monthly-sales',
    category: 'advanced',
    tag: 'Running Cumulative Total',
    title: 'Running Monthly Sale Value across 2024-2025',
    description: 'Calculates the cumulative monthly transaction velocity across the 2-year portfolio timeline.',
    code: `-- Calculate running (cumulative) monthly sale value across 2024-2025
WITH monthly_sales AS (
    SELECT 
        YEAR(b.booking_date) AS sale_year,
        MONTH(b.booking_date) AS sale_month,
        SUM(b.sale_price) AS monthly_total
    FROM properties p
    INNER JOIN property_bookings b ON p.property_id = b.property_id
    GROUP BY sale_year, sale_month
    ORDER BY sale_year, sale_month
)
SELECT 
    sale_year,
    sale_month,
    monthly_total,
    SUM(monthly_total) OVER (
        ORDER BY sale_year, sale_month
    ) AS running_total
FROM monthly_sales
ORDER BY sale_year, sale_month;`
  },
  {
    id: 'q22-buyer-tier-segmentation',
    category: 'business',
    tag: 'Customer Segmentation',
    title: 'Buyer Tier Segmentation (Budget, Mid, Premium)',
    description: 'Segments buyers into commercial tiers based on aggregated spending thresholds using CASE expressions.',
    code: `-- Segment buyers into 'Premium', 'Mid' and 'Budget' tiers
-- based on total spend using CASE combined with aggregation
WITH buyer_spent AS (
    SELECT 
        b.buyer_name,
        SUM(b.sale_price) AS total_spent
    FROM properties p 
    INNER JOIN property_bookings b ON p.property_id = b.property_id
    GROUP BY b.buyer_name
),
category_count AS (
    SELECT 
        CASE 
            WHEN total_spent <= 50000000 THEN 'Budget'
            WHEN total_spent BETWEEN 50000001 AND 200000000 THEN 'Mid'
            WHEN total_spent > 200000000 THEN 'Premium'
        END AS Price_category
    FROM buyer_spent
)
SELECT 
    Price_category,
    COUNT(Price_category) AS count_of_buyers
FROM category_count
GROUP BY Price_category
ORDER BY count_of_buyers DESC;`
  },
  {
    id: 'q17-rank-builders',
    category: 'business',
    tag: 'Competitive Benchmarking',
    title: 'Rank Builders by Total Sales Value (RANK)',
    description: 'Benchmarking top real estate developers across sales generated using analytical window ranking.',
    code: `-- Rank builders by total sale value generated using RANK()
SELECT 
    p.builder,
    SUM(b.sale_price) AS Total_sale_value,
    RANK() OVER (ORDER BY SUM(b.sale_price) DESC) AS Ranking_of_builders
FROM properties p
INNER JOIN property_bookings b ON p.property_id = b.property_id
GROUP BY p.builder
ORDER BY Ranking_of_builders ASC;`
  },
  {
    id: 'q-reusable-reporting-view',
    category: 'schema',
    tag: 'Reusable BI Data Model',
    title: 'Clean Reusable Reporting View (Real_estate_summury)',
    description: 'Enterprise SQL view that merges property attributes with booking financials for instant consumption in Power BI and Excel.',
    code: `-- CREATE OR REPLACE VIEW for direct Power BI & Excel ingestion
CREATE OR REPLACE VIEW Real_estate_summury AS
SELECT 
    p.property_id,
    p.project_name,
    p.builder,
    p.city,
    p.locality,
    p.property_type,
    p.price_per_sqft,
    p.base_price,
    p.year_built,
    b.transaction_id,
    b.booking_date,
    b.buyer_id,
    b.buyer_name,
    b.sales_channel,
    b.discount_amount,
    b.sale_price,
    b.loan_amount,
    b.down_payment
FROM properties p
INNER JOIN property_bookings b ON p.property_id = b.property_id;`
  },
  {
    id: 'q-eda-data-audit',
    category: 'eda',
    tag: 'Data Quality & EDA',
    title: 'Missing Values & Duplicate Integrity Audit',
    description: 'Validates primary key uniqueness, foreign key consistency, and checks for missing categorical or financial data.',
    code: `-- 1. Check Missing Values in Properties and Bookings Tables
SELECT 
    SUM(CASE WHEN project_name IS NULL THEN 1 ELSE 0 END) AS missing_project_name,
    SUM(CASE WHEN builder IS NULL THEN 1 ELSE 0 END) AS missing_builder_name,
    SUM(CASE WHEN city IS NULL THEN 1 ELSE 0 END) AS missing_city
FROM properties;

-- 2. Audit Uniqueness & Potential Duplicate Transactions
SELECT 
    transaction_id, 
    COUNT(*) AS occurrence_count
FROM property_bookings
GROUP BY transaction_id
HAVING COUNT(*) > 1;`
  }
];

function initSqlAnalyticsLab() {
  const queryListContainer = document.getElementById('sql-query-list');
  const codeContentElem = document.getElementById('sql-code-content');
  const metaTitleElem = document.getElementById('sql-meta-title');
  const metaDescElem = document.getElementById('sql-meta-desc');
  const copyBtn = document.getElementById('sql-copy-btn');
  const categoryTabs = document.querySelectorAll('.sql-tab-btn');

  if (!queryListContainer || !codeContentElem) return;

  let currentCategory = 'all';
  let activeQueryId = SQL_QUERIES_DATA[0].id;

  function renderQueryList() {
    queryListContainer.innerHTML = '';
    const filtered = SQL_QUERIES_DATA.filter(q => currentCategory === 'all' || q.category === currentCategory);

    filtered.forEach((query) => {
      const item = document.createElement('div');
      item.className = `sql-query-item ${query.id === activeQueryId ? 'active' : ''}`;
      item.innerHTML = `
        <div class="query-item-tag">${query.tag}</div>
        <div class="query-item-title">${query.title}</div>
      `;
      item.addEventListener('click', () => {
        activeQueryId = query.id;
        renderQueryList();
        displayQuery(query);
      });
      queryListContainer.appendChild(item);
    });

    // If active query is filtered out, select first available
    const activeExists = filtered.some(q => q.id === activeQueryId);
    if (!activeExists && filtered.length > 0) {
      activeQueryId = filtered[0].id;
      renderQueryList();
      displayQuery(filtered[0]);
    }
  }

  function displayQuery(query) {
    if (metaTitleElem) metaTitleElem.textContent = query.title;
    if (metaDescElem) metaDescElem.textContent = query.description;
    
    // Highlight syntax keywords
    codeContentElem.innerHTML = highlightSql(query.code);
  }

  // Syntax highlighter for SQL
  function highlightSql(sql) {
    const escaped = escapeHtml(sql);
    
    return escaped
      // Comments
      .replace(/(--.*?$)/gm, '<span class="sql-comment">$1</span>')
      // Strings
      .replace(/('.*?')/g, '<span class="sql-string">$1</span>')
      // Keywords
      .replace(/\b(SELECT|FROM|WHERE|INNER JOIN|LEFT JOIN|RIGHT JOIN|JOIN|ON|GROUP BY|ORDER BY|HAVING|WITH|AS|OVER|PARTITION BY|CASE|WHEN|THEN|ELSE|END|CREATE|OR|REPLACE|VIEW|TABLE|DROP|DATABASE|USE|DESC|ASC|BETWEEN|AND|LIMIT|DISTINCT|IS|NULL|NOT|ROUND)\b/gi, '<span class="sql-keyword">$1</span>')
      // Functions
      .replace(/\b(ROW_NUMBER|RANK|DENSE_RANK|LAG|LEAD|SUM|COUNT|AVG|MIN|MAX|YEAR|MONTH)\b/gi, '<span class="sql-function">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="sql-number">$1</span>');
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Category tab clicks
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-cat');
      renderQueryList();
    });
  });

  // Copy SQL button
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const activeObj = SQL_QUERIES_DATA.find(q => q.id === activeQueryId);
      if (activeObj) {
        navigator.clipboard.writeText(activeObj.code).then(() => {
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
          `;
          showToast('SQL Query copied to clipboard');
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
          }, 2000);
        });
      }
    });
  }

  // Initial load
  renderQueryList();
  displayQuery(SQL_QUERIES_DATA[0]);
}

/* =====================================================================
   6. CASE STUDY MODALS
   ===================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const closeButtons = document.querySelectorAll('.modal-close-btn');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetModalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  const modalLinks = document.querySelectorAll('.modal-close-btn-link');
  modalLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeAllModals();
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  function closeAllModals() {
    modalOverlays.forEach(overlay => overlay.classList.remove('active'));
    document.body.style.overflow = '';
  }
}

/* =====================================================================
   7. IMAGE LIGHTBOX
   ===================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const zoomTriggers = document.querySelectorAll('[data-zoom-src]');

  if (!lightbox || !lightboxImg) return;

  zoomTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-zoom-src') || trigger.getAttribute('src');
      const caption = trigger.getAttribute('data-caption') || 'Dashboard View';
      
      lightboxImg.setAttribute('src', src);
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
}

/* =====================================================================
   8. CONTACT FORM HANDLER & TOAST
   ===================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.form-submit-btn');
      const originalText = submitBtn.innerHTML;

      // Visual sending state
      submitBtn.innerHTML = `Sending Message...`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();

        if (feedback) {
          feedback.textContent = 'Thank you! Your message has been sent successfully. Anand will get back to you shortly.';
          feedback.className = 'form-feedback success';
          feedback.style.display = 'block';

          setTimeout(() => {
            feedback.style.display = 'none';
          }, 6000);
        }

        showToast('Message sent! Thanks for reaching out.');
      }, 1000);
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'anandbhujbal35@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard: ' + email);
      });
    });
  }
}

/* =====================================================================
   9. GLOBAL TOAST NOTIFICATION
   ===================================================================== */
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 14 14"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
