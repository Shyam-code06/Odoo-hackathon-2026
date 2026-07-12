const dashboardService = require('../services/dashboardService');

const getFMId = (req) => req.user.fleetManagerId || req.user.id;

const getDashboardKPIs = async (req, res, next) => {
  try {
    const kpis = await dashboardService.getDashboardKPIs(req.query, getFMId(req));
    return res.status(200).json(kpis);
  } catch (err) { next(err); }
};

const getDashboardCharts = async (req, res, next) => {
  try {
    const charts = await dashboardService.getDashboardCharts(getFMId(req));
    return res.status(200).json(charts);
  } catch (err) { next(err); }
};

module.exports = { getDashboardKPIs, getDashboardCharts };
