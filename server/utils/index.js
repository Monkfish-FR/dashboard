const merge = require('deepmerge');

module.exports = {
  /**
   * Put the data of the foreign table in a sub-object
   *
   * @param {[]} row The result of a query or a row of a dataset
   * @returns {{}} The formatted data
   *
   * @example
   * Input: {
   *   c_id: 1,
   *   c_firstName: 'John',
   *   structure_id: 1,
   *   structure_title: 'TheBigCompany',
   * }
   * Call: formatUtilsRow(input)
   * Output: {
   *   id: 1,
   *   firstName: 'John',
   *   structure: {
   *     id: 1,
   *     title: 'TheBigCompany',
   *   },
   * }
   */
  formatRow: function formatRow(row) {
    if (!row) return row;

    let formattedRow = {};

    Object.entries(row).forEach(([k, value]) => {
      const levels = k.split('_');
      levels.reverse(); // the last level will be treated in first

      const nestedObject = levels.reduce((previous, current) => {
        // on first step, value is given to the last level
        if (previous === value) {
          return { [current]: previous };
        }
        // then sub-level is assign to the current level
        return { [`${current}Data`]: { ...previous } };
      }, value); // initialize .reduce() with the value

      // deep merge to preserve previous properties
      // @see https://github.com/TehShrike/deepmerge
      formattedRow = merge(formattedRow, nestedObject);
    });

    return formattedRow;
  },

  formatRows: function formatRows(rows) {
    if (!rows) return rows;

    const formattedRows = [];

    rows.forEach((row) => {
      const formatted = this.formatRow(row);
      formattedRows.push(formatted);
    });

    return formattedRows;
  },

  /**
  * Converts an ISOString date to SQLite datetime format
  * (YYYY-MM-DD HH:MM:SS)
  */
  convertIso: function convertIso(iso) {
    const [date] = iso.split('.');

    return date.replace('T', ' ');
  },
};
