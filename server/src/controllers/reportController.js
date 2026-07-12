const reportService = require('../services/reportService');

const getFuelEfficiencyReport = async (req, res, next) => {
  try {
    const report = await reportService.getFuelEfficiencyReport();
    return res.status(200).json(report);
  } catch (err) {
    next(err);
  }
};

const getOperationalCostReport = async (req, res, next) => {
  try {
    const report = await reportService.getOperationalCostReport();
    return res.status(200).json(report);
  } catch (err) {
    next(err);
  }
};

const getROIReport = async (req, res, next) => {
  try {
    const report = await reportService.getROIReport();
    return res.status(200).json(report);
  } catch (err) {
    next(err);
  }
};

const exportCSV = async (req, res, next) => {
  try {
    const csv = await reportService.exportCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="fleet_report.csv"');
    return res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};

const exportPDF = async (req, res, next) => {
  try {
    // PDF export is optional/bonus. We will return a simple message or generate HTML/mock to keep it light.
    // Or we can return the report data as JSON, suggesting the client print it or download.
    const data = await reportService.getVehiclesReportData();
    return res.status(200).json({
      message: 'PDF generation endpoint. Print this data to PDF on client side.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFuelEfficiencyReport,
  getOperationalCostReport,
  getROIReport,
  exportCSV,
  exportPDF,
};
