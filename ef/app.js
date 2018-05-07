var _app = ef.create('\n\
>table.table.table-striped.latest-data\n\
	>tbody\n\
		+trs');

var _tr = ef.create('\n\
>tr\n\
	>td.dbname\n\
		.{{dbname}}\n\
	>td.query-count\n\
		>span.{{lastSample.countClassName}}\n\
			.{{lastSample.nbQueries}}\n\
	+tds');

var _td = ef.create('\n\
>td.Query.{{elapsedClassName}}\n\
	.{{formatElapsed}}\n\
	>div.popover.left\n\
		>div.popover-content\n\
			.{{query}}\n\
		>div.arrow');

var app = new _app()

function renderTd(tr, q, index) {
	if (!tr.tds[index]) tr.tds.push(new _td())
	tr.tds[index].$data = {
		elapsedClassName: q.elapsedClassName,
		formatElapsed: q.formatElapsed,
		query: q.query
	}
}

function renderTr(db, index) {
	if (!app.trs[index]) app.trs.push(new _tr())
	var tr = app.trs[index]
	tr.$data = {
		dbname: db.dbname,
		lastSample: {
			countClassName: db.lastSample.countClassName,
			nbQueries: db.lastSample.nbQueries
		}
	}
	for (var i in db.lastSample.topFiveQueries) renderTd(tr, db.lastSample.topFiveQueries[i], i)
}

function renderTb(databases) {
	// ef.inform()
	for (var i in databases) renderTr(databases[i], i)
	// ef.exec()
}

function loadSamples() {
  renderTb(ENV.generateData(true).toArray());
  Monitoring.renderRate.ping();
  setTimeout(loadSamples, ENV.timeout);
}

app.$mount({target: document.querySelector('#app')})
loadSamples()
