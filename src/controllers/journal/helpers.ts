import Journal from '../../models/journal';

export const getUserJournalByUserId = async (userId: string) => {
  try {
    return Journal.findOne({ where: { UserId: userId } });
  } catch (err) {
    throw err;
  }
};
