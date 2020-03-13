/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const excel = require('xlsx');
const fastly = require('@adobe/fastly-native-promises');
const { URL } = require('url');
/**
 * This is the main function
 * @param {string} name name of the person to greet
 * @returns {string} a greeting
 */
function main(args) {
  const [,, id, token] = args;
  const service = fastly(token, id);
  const workbook = excel.readFile('urls.xlsx');
  const data = excel.utils.sheet_to_json(workbook.Sheets.urls).map(({year, url}) => ({item_key: new URL(url).pathname.replace(/\/$/, ''), item_value: year, op: 'upsert'}));

  service.bulkUpdateDictItems(undefined, 'redirects', ...data).then(() => console.log(data.length, 'items imported'));
}

main(process.argv);
