import ReportLogs from '../../models/report_log';

export const updateReportLogInstance = async (
  logId: number,
  discomfortRating: string | null,
  notes: string,
  logTimestamp: string
) => {
  try {
    if (!discomfortRating) discomfortRating = null;
    return await ReportLogs.update(
      {
        logTimestamp,
        discomfortRating: discomfortRating,
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

// Given a date, returns a new date with the amount of hours subtracted
export const subtractHoursFromDate = (hours: number, date: Date) => {
  const MS_IN_MINUTE = 60000;

  const givenDateInMs = date.valueOf();
  const msToSubtract = hours * (MS_IN_MINUTE * 60);

  return new Date(givenDateInMs - msToSubtract);
};
