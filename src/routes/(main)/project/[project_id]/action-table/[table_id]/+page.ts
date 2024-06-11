/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from '$env/dynamic/public';
import logger from '$lib/logger.js';
import type { ActionTable, ActionTableRow } from '$lib/types.js';

const { PUBLIC_JAMAI_URL } = env;

export const load = async ({ depends, fetch, params, parent, url }) => {
	depends('action-table:slug');
	await parent();
	const page = parseInt(url.searchParams.get('page') ?? '1');

	const getTable = async () => {
		const fetchPromises = [
			fetch(
				`${PUBLIC_JAMAI_URL}/api/v1/gen_tables/action/${params.table_id}?` +
					new URLSearchParams({
						offset: '0',
						limit: '1'
					})
			),
			fetch(
				`${PUBLIC_JAMAI_URL}/api/v1/gen_tables/action/${params.table_id}/rows?` +
					new URLSearchParams({
						offset: ((page - 1) * 100).toString(),
						limit: '100'
					})
			)
		];

		const [responseTableData, responseRows] = await Promise.all(fetchPromises);
		const [tableData, rows] = await Promise.all([responseTableData.json(), responseRows.json()]);

		if (!responseTableData.ok || !responseRows.ok) {
			if (responseTableData.status !== 404 && responseTableData.status !== 422) {
				logger.error('ACTIONTBL_TBL_GET', { tableData, rows });
			}
			return { error: responseTableData.status, message: JSON.stringify({ tableData, rows }) };
		} else {
			return {
				tableData: tableData as ActionTable,
				rows: rows.items as ActionTableRow[],
				total_rows: rows.total
			};
		}
	};

	return {
		table: params.table_id ? await getTable() : undefined
	};
};
