export default function ExportCsv(columnList, initialData, filename, t) {
  const columns = columnList.filter((columnDef) => {
    return columnDef.field && columnDef.export !== false;
  });

  const data = initialData.map((rowData) =>
    columns.map((columnDef) => {
      if (columnDef.field === "user.name") return rowData.user.name;
      if (columnDef.field === "status")
        return t(`Record.StatusType.${rowData[columnDef.field]}`);
      if (columnDef.field === "last_modified")
        return new Date(rowData.last_modified * 1000).toLocaleString();
      return columnDef.render
        ? columnDef.render(rowData)
        : rowData[columnDef.field];
    })
  );

  let csvAry = [];

  csvAry.push(columns.map((column) => column.title));
  csvAry = csvAry.concat(data);

  let csvContent = "data:text/csv;charset=utf-8,\ufeff";
  csvContent += '"' + csvAry.map((row) => row.join('","')).join('"\n"') + '"';

  let uri = encodeURI(csvContent);
  let link = window.document.createElement("a");
  link.setAttribute("href", uri);
  link.setAttribute("download", filename + ".csv");

  window.document.body.appendChild(link);
  link.click();
  link.remove();
}
