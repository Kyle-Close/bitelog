import Journal from '../../models/journal';

export const getUserJournalById = async (id: number) => {
  try {
    return Journal.findOne({ where: { id } });
  } catch (err) {
    throw err;
  }
};
