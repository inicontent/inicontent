import { isArrayOfObjects } from "inibase/utils";

export default function (schema: Schema, startWithID = 0) {
	function _addIdToField(field: Field) {
		if (!field.id) {
			startWithID++;
			field.id = startWithID;
		}

		if (
			(field.type === "array" || field.type === "object") &&
			isArrayOfObjects(field.children)
		)
			field.children = _addIdToSchema(field.children);
		return field;
	}
	const _addIdToSchema = (schema: Schema) => schema.map(_addIdToField);

	return _addIdToSchema(schema);
}
