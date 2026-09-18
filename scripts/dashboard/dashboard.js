/**
 * Agent Specification Monitoring Dashboard
 *
 * Interactive dashboard for visualising validation reports and system health.
 */

class Dashboard {
  constructor() {
    this.data = null;
    this.filteredData = null;
    this.charts = {};
    this.init();
  }

  /**
   * Initialize dashboard
   */
  init() {
    this.setupEventListeners();
    this.setupDarkMode();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    document
      .getElementById("reportFile")
      .addEventListener("change", (e) => this.loadReport(e));
    document
      .getElementById("refreshBtn")
      .addEventListener("click", () => this.refresh());
    document
      .getElementById("downloadBtn")
      .addEventListener("click", () => this.download());
    document
      .getElementById("searchFilter")
      .addEventListener("input", () => this.applyFilters());
    document
      .getElementById("statusFilter")
      .addEventListener("change", () => this.applyFilters());
    document
      .getElementById("severityFilter")
      .addEventListener("change", () => this.applyFilters());
    document
      .getElementById("darkMode")
      .addEventListener("change", (e) => this.toggleDarkMode(e));
  }

  /**
   * Setup dark mode
   */
  setupDarkMode() {
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
      document.body.classList.add("dark-mode");
      document.getElementById("darkMode").checked = true;
    }
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(e) {
    const isDark = e.target.checked;
    if (isDark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", isDark);
  }

  /**
   * Load validation report from file
   */
  loadReport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        this.data = JSON.parse(e.target.result);
        this.filteredData = JSON.parse(JSON.stringify(this.data));
        this.render();
      } catch (error) {
        alert("Error parsing report: " + error.message);
      }
    };
    reader.readAsText(file);
  }

  /**
   * Refresh dashboard
   */
  refresh() {
    if (this.data) {
      this.render();
    }
  }

  /**
   * Download current data as JSON
   */
  download() {
    if (!this.data) return;

    const dataStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `validation-report-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  }

  /**
   * Apply filters to data
   */
  applyFilters() {
    const searchQuery = document
      .getElementById("searchFilter")
      .value.toLowerCase();
    const statusFilter = document.getElementById("statusFilter").value;
    const severityFilter = document.getElementById("severityFilter").value;

    this.filteredData = JSON.parse(JSON.stringify(this.data));

    if (!this.filteredData.validations) return;

    this.filteredData.validations = this.filteredData.validations.filter(
      (validation) => {
        // Search filter
        if (
          searchQuery &&
          !validation.file.toLowerCase().includes(searchQuery)
        ) {
          return false;
        }

        // Status filter
        if (statusFilter) {
          const isPasssed = validation.passed;
          if (statusFilter === "passed" && !isPasssed) return false;
          if (statusFilter === "failed" && isPasssed) return false;
        }

        // Severity filter
        if (severityFilter && validation.findings) {
          const hasSeverity = validation.findings.some(
            (f) => f.severity === severityFilter,
          );
          if (!hasSeverity) return false;
        }

        return true;
      },
    );

    this.renderResults();
  }

  /**
   * Render entire dashboard
   */
  render() {
    this.renderStatusOverview();
    this.renderCharts();
    this.renderResults();
    this.renderTimestamp();
  }

  /**
   * Render status overview
   */
  renderStatusOverview() {
    if (!this.data || !this.data.summary) return;

    const { summary } = this.data;
    const status = this.getOverallStatus();

    document.getElementById("statusTitle").textContent =
      this.getStatusTitle(status);
    document.getElementById("statusMessage").textContent =
      this.getStatusMessage(status, summary);
    document.getElementById("totalAgents").textContent = summary.totalAgents;
    document.getElementById("passedAgents").textContent = summary.passedAgents;
    document.getElementById("errorCount").textContent = summary.errors;
    document.getElementById("warningCount").textContent = summary.warnings;

    const indicator = document.getElementById("statusIndicator");
    indicator.className = `status-indicator ${status}`;
    indicator.textContent = this.getStatusEmoji(status);

    const card = document.getElementById("statusCard");
    card.className = `status-card status-${status}`;
  }

  /**
   * Get overall status
   */
  getOverallStatus() {
    if (!this.data || !this.data.summary) return "unknown";

    const { errors } = this.data.summary;
    if (errors > 0) return "critical";

    const { warnings } = this.data.summary;
    return warnings > 0 ? "warning" : "healthy";
  }

  /**
   * Get status title
   */
  getStatusTitle(status) {
    const titles = {
      healthy: "✓ System Healthy",
      warning: "⚠ Warning",
      critical: "✗ Critical Issues",
    };
    return titles[status] || "Unknown Status";
  }

  /**
   * Get status message
   */
  getStatusMessage(status, summary) {
    if (status === "critical") {
      return `${summary.errors} error${summary.errors !== 1 ? "s" : ""} found in validation`;
    }
    if (status === "warning") {
      return `${summary.warnings} warning${summary.warnings !== 1 ? "s" : ""} found in validation`;
    }
    return "All specifications validated successfully";
  }

  /**
   * Get status emoji
   */
  getStatusEmoji(status) {
    const emojis = {
      healthy: "✓",
      warning: "⚠",
      critical: "✗",
    };
    return emojis[status] || "?";
  }

  /**
   * Render charts
   */
  renderCharts() {
    this.renderStatusChart();
    this.renderSeverityChart();
  }

  /**
   * Render status distribution chart
   */
  renderStatusChart() {
    if (!this.data || !this.data.validations) return;

    const canvas = document.getElementById("statusChart");
    const ctx = canvas.getContext("2d");

    const passed = this.data.validations.filter((v) => v.passed).length;
    const failed = this.data.validations.length - passed;

    // Clear previous chart
    if (this.charts.status) {
      this.charts.status.destroy();
    }

    // Simple bar chart using canvas
    this.drawBarChart(ctx, [
      { label: "Passed", value: passed, color: "#16a34a" },
      { label: "Failed", value: failed, color: "#dc2626" },
    ]);
  }

  /**
   * Render severity chart
   */
  renderSeverityChart() {
    if (!this.data || !this.data.summary) return;

    const canvas = document.getElementById("severityChart");
    const ctx = canvas.getContext("2d");

    const { errors, warnings } = this.data.summary;

    // Clear previous chart
    if (this.charts.severity) {
      this.charts.severity.destroy();
    }

    // Simple bar chart using canvas
    this.drawBarChart(ctx, [
      { label: "Errors", value: errors, color: "#dc2626" },
      { label: "Warnings", value: warnings, color: "#ea580c" },
    ]);
  }

  /**
   * Draw simple bar chart
   */
  drawBarChart(ctx, data) {
    const padding = 40;
    const chartWidth = ctx.canvas.width - 2 * padding;
    const chartHeight = ctx.canvas.height - 2 * padding;
    const barWidth = chartWidth / (data.length * 2);
    const maxValue = Math.max(...data.map((d) => d.value), 1);

    // Draw background
    ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
    ctx.fillRect(padding, padding, chartWidth, chartHeight);

    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding + index * (chartWidth / data.length) + barWidth / 2;
      const y = padding + chartHeight - barHeight;

      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = "#666";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.label, x + barWidth / 2, padding + chartHeight + 20);

      // Draw value
      ctx.fillStyle = "#333";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
    });

    // Draw axes
    ctx.strokeStyle = "#ccc";
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
  }

  /**
   * Render results list
   */
  renderResults() {
    if (!this.filteredData || !this.filteredData.validations) {
      document.getElementById("resultsList").innerHTML =
        '<p class="placeholder">No data loaded. Load a validation report to view results.</p>';
      return;
    }

    const resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = "";

    this.filteredData.validations.forEach((validation, index) => {
      const resultItem = this.createResultItem(validation, index);
      resultsList.appendChild(resultItem);
    });

    if (this.filteredData.validations.length === 0) {
      resultsList.innerHTML =
        '<p class="placeholder">No results match the current filters.</p>';
    }
  }

  /**
   * Create result item element
   */
  createResultItem(validation, _index) {
    const item = document.createElement("div");
    item.className = "result-item";

    const statusClass = validation.passed ? "passed" : "failed";
    const statusIcon = validation.passed ? "✓" : "✗";
    const issueText = `${validation.issueCount} issue${validation.issueCount !== 1 ? "s" : ""}`;

    const header = document.createElement("div");
    header.className = `result-header ${statusClass}`;
    header.innerHTML = `
      <div class="result-title">
        <span>${statusIcon}</span>
        <span>${validation.file}</span>
      </div>
      <div class="result-status">${issueText}</div>
    `;

    const findings = document.createElement("div");
    findings.className = "result-findings";

    if (validation.findings && validation.findings.length > 0) {
      validation.findings.forEach((finding) => {
        const findingEl = document.createElement("div");
        findingEl.className = `finding ${finding.severity}`;
        findingEl.innerHTML = `
          <span class="finding-severity ${finding.severity}">${finding.severity}</span>
          <span>${finding.message}</span>
          ${finding.field ? `<span> (${finding.field})</span>` : ""}
        `;
        findings.appendChild(findingEl);
      });
    } else {
      const noIssues = document.createElement("p");
      noIssues.style.color = "var(--success)";
      noIssues.textContent = "✓ No issues found";
      findings.appendChild(noIssues);
    }

    header.addEventListener("click", () => {
      findings.classList.toggle("expanded");
    });

    item.appendChild(header);
    item.appendChild(findings);

    return item;
  }

  /**
   * Render timestamp
   */
  renderTimestamp() {
    if (!this.data || !this.data.timestamp) return;

    const date = new Date(this.data.timestamp);
    const formattedDate = date.toLocaleString();

    document.getElementById("timestamp").textContent =
      `Report timestamp: ${formattedDate}`;
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new Dashboard();
});
