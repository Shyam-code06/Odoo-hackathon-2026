const reportService = require('../services/reportService');

const getFMId = (req) => req.user.fleetManagerId || req.user.id;

const getFuelEfficiencyReport = async (req, res, next) => {
  try {
    const report = await reportService.getFuelEfficiencyReport(getFMId(req));
    return res.status(200).json(report);
  } catch (err) { next(err); }
};

const getOperationalCostReport = async (req, res, next) => {
  try {
    const report = await reportService.getOperationalCostReport(getFMId(req));
    return res.status(200).json(report);
  } catch (err) { next(err); }
};

const getROIReport = async (req, res, next) => {
  try {
    const report = await reportService.getROIReport(getFMId(req));
    return res.status(200).json(report);
  } catch (err) { next(err); }
};

const exportCSV = async (req, res, next) => {
  try {
    const csv = await reportService.exportCSV(getFMId(req));
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="fleet_report.csv"');
    return res.status(200).send(csv);
  } catch (err) { next(err); }
};

const exportPDF = async (req, res, next) => {
  try {
    const data = await reportService.getVehiclesReportData(getFMId(req));
    return res.status(200).json({
      message: 'PDF generation endpoint. Print this data to PDF on client side.',
      data,
    });
  } catch (err) { next(err); }
};

module.exports = { getFuelEfficiencyReport, getOperationalCostReport, getROIReport, exportCSV, exportPDF };
