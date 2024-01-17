import ReportLogs from '../../models/report_log';

export const updateReportLogInstance = async (
  logId: number,
  discomfortRating: string,
  notes: string
) => {
  try {
    return await ReportLogs.update(
      {
        discomfort_rating: discomfortRating,
        notes: notes,
      },
      {
        where: {
          id: logId,
        },
        returning: true,
      }
    );
  } catch (err) {
    throw err;
  }
};
