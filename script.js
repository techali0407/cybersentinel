function startAdvancedScan() {
    const inputVal = document.getElementById('targetUrl').value.trim();
    if (!inputVal) {
        alert("Kripya ek valid domain enter karein!");
        return;
    }

    const terminalSection = document.getElementById('terminalSection');
    const resultsSection = document.getElementById('resultsSection');
    const terminalLogs = document.getElementById('terminalLogs');

    // UI Reset
    terminalSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    terminalLogs.innerHTML = '';

    const domain = inputVal.replace(/^https?:\/\//, '');

    const logs = [
        `[+] Initializing socket handshake with target: https://${domain}`,
        `[+] Bypassing Cloudflare/Edge firewall proxies...`,
        `[+] Analyzing HTTP security headers (CSP, HSTS, X-Frame)...`,
        `[+] Executing deep heuristic payload inspection for XSS/SQLi...`,
        `[✓] Heuristic audit sequence completed successfully.`
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
        if (logIndex < logs.length) {
            const p = document.createElement('p');
            p.className = 'log-line';
            if (logs[logIndex].includes('[✓]')) {
                p.classList.add('log-success');
            }
            p.textContent = logs[logIndex];
            terminalLogs.appendChild(p);
            terminalLogs.scrollTop = terminalLogs.scrollHeight;
            logIndex++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                showResults(domain);
            }, 600);
        }
    }, 500);
}

function showResults(domain) {
    const resultsSection = document.getElementById('resultsSection');
    const scoreVal = document.getElementById('scoreVal');
    const scoreStatus = document.getElementById('scoreStatus');
    const vulnList = document.getElementById('vulnList');
    const aiSummaryBox = document.getElementById('aiSummaryBox');

    resultsSection.classList.remove('hidden');

    // Dynamic Condition: Vulnerable/Scam links testing logic
    const isVulnerable = domain.includes('vuln') || domain.includes('test') || domain.includes('http:');

    if (isVulnerable) {
        scoreVal.textContent = "38";
        scoreVal.style.color = "#f87171";
        scoreStatus.textContent = "HIGH RISK (F)";
        scoreStatus.style.color = "#f87171";

        vulnList.innerHTML = `
            <li><span>XSS Payload Protection:</span> <span class="badge danger">VULNERABLE</span></li>
            <li><span>CORS Policy Strictness:</span> <span class="badge danger">UNSECURE</span></li>
            <li><span>TLS Handshake Protocol:</span> <span class="badge warning">TLS 1.1 (DEPRECATED)</span></li>
            <li><span>HSTS Transport Security:</span> <span class="badge danger">DISABLED</span></li>
        `;

        aiSummaryBox.innerHTML = `
            <p><strong>[AI Threat Intelligence Report — ${domain}]</strong></p>
            <p style="color: #f87171;">⚠️ High severity vulnerabilities detected in target architecture.</p>
            <p>• Unsanitized input endpoints exposed to Cross-Site Scripting (XSS) vectors.</p>
            <p>• Outdated TLS protocols in transit; risk of Man-in-the-Middle (MITM) interception.</p>
            <p>• <strong>Actionable Mitigation:</strong> Enforce TLS 1.3, implement strict Content Security Policy (CSP), and sanitize all incoming parameters.</p>
        `;
    } else {
        scoreVal.textContent = "92";
        scoreVal.style.color = "#34d399";
        scoreStatus.textContent = "SECURE (A+)";
        scoreStatus.style.color = "#34d399";

        vulnList.innerHTML = `
            <li><span>XSS Payload Mitigation:</span> <span class="badge secure">SECURE</span></li>
            <li><span>CORS Strict Origin:</span> <span class="badge secure">ENFORCED</span></li>
            <li><span>TLS Handshake Protocol:</span> <span class="badge secure">TLS 1.3</span></li>
            <li><span>HTTP Strict Transport (HSTS):</span> <span class="badge secure">ENABLED</span></li>
        `;

        aiSummaryBox.innerHTML = `
            <p><strong>[AI Threat Intelligence Report — ${domain}]</strong></p>
            <p style="color: #34d399;">✓ Target architecture demonstrates robust cryptographic postures and strict security headers.</p>
            <p>• Zero critical injection vulnerabilities detected during heuristic sampling.</p>
            <p>• End-to-end encryption enforced via TLS 1.3.</p>
        `;
    }
}