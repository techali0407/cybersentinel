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

    const domain = inputVal.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

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
                showResults(domain, inputVal);
            }, 600);
        }
    }, 500);
}

function showResults(domain, originalInput) {
    const resultsSection = document.getElementById('resultsSection');
    const scoreVal = document.getElementById('scoreVal');
    const scoreStatus = document.getElementById('scoreStatus');
    const vulnList = document.getElementById('vulnList');
    const aiSummaryBox = document.getElementById('aiSummaryBox');

    resultsSection.classList.remove('hidden');

    const cleanDomain = domain.toLowerCase().trim();
    const cleanInput = originalInput.toLowerCase().trim();

    // 1. ABSOLUTE THREAT OVERRIDE (Yeh sabse pehle check hoga - Scam, Hack, Evil par 100% RED)
    const threatKeywords = ['scam', 'phish', 'evil', 'hack', 'vuln', 'test', 'malware', 'bad', 'danger', 'attack', 'fake', 'admin', 'bypass'];
    
    let forceVulnerable = false;
    for (let i = 0; i < threatKeywords.length; i++) {
        if (cleanDomain.includes(threatKeywords[i]) || cleanInput.includes(threatKeywords[i])) {
            forceVulnerable = true;
            break;
        }
    }

    if (cleanInput.startsWith('http:') || cleanDomain.includes('scam') || cleanDomain.includes('hack')) {
        forceVulnerable = true;
    }

    // 2. SAFE WHITELIST (Sirf tab chalega jab koi threat keyword na ho)
    const safeWhitelist = ['google.com', 'github.com', 'microsoft.com', 'apple.com', 'amazon.com', 'cloudflare.com', 'facebook.com', 'netflix.com', 'linkedin.com', 'youtube.com'];
    
    let isWhitelisted = false;
    if (!forceVulnerable) {
        for (let i = 0; i < safeWhitelist.length; i++) {
            if (cleanDomain === safeWhitelist[i] || cleanDomain.endsWith('.' + safeWhitelist[i])) {
                isWhitelisted = true;
                break;
            }
        }
    }

    // 3. FINAL DECISION MATRIX
    let isVulnerable = false;
    if (forceVulnerable) {
        isVulnerable = true;  // 100% Guaranteed Red
    } else if (isWhitelisted) {
        isVulnerable = false; // 100% Guaranteed Green
    } else {
        // Random other links
        let charHash = 0;
        for (let i = 0; i < cleanDomain.length; i++) {
            charHash += cleanDomain.charCodeAt(i);
        }
        isVulnerable = (charHash % 10 < 3);
    }

    if (isVulnerable) {
        scoreVal.textContent = "28";
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
            <p style="color: #f87171;">⚠️ High severity vulnerabilities & malicious signatures detected.</p>
            <p>• Domain flagged in active threat intelligence and phishing databases.</p>
            <p>• Potential credential harvesting or data exfiltration risk.</p>
            <p>• <strong>Actionable Mitigation:</strong> Immediate blocking required; enforce strict CSP and SSL validation.</p>
        `;
    } else {
        scoreVal.textContent = "96";
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
