# CMS Controller

## Search
Docs for the search option in the grid (top right corner):
http://stackoverflow.com/questions/20434088/angularjs-ng-grid-filter-filtertext-format

### Search All Fields in Grid

By default, filterText executes a regex against every cell in the grid. Typing in the character 'a' selects all records that have the character 'a' in any entry (or column) of that record. Typing 'ab' selects all records that have the character sequence 'ab' in any entry of that record. Depending on your requirements, this behavior may be perfectly suitable. However, with large data sets, one typically wants to filter on columns rather than the whole grid because of the nature of the data (e.g. select a price ticker) and because of the high cost of searching the whole grid.

### Search By Column

In order to search for a string or regex on just one column, the filterText syntax is:

filterText = '<displayName>:<literal>'
For instance,

### first column filter

Here the displayName 'Date' (don't use the field value, you must use displayName) is followed by a colon ':' and then a partial string. The result is that only three records are selected, those associated with Oct 30th.

Let's expand the search. To search for Oct 30th or Oct 31st, the syntax is

filterText = '<displayName>:<literal 1>|<literal 2>|...'
where a pipe '|' separates each string partial. You can chain together however as many as you like. A multi-date filter might look like:

Clearly the selection is OR in nature. My example is not great, however, because tickers and dates have disjoint characters. So you can either trust me that only the Date column is searched or setup your own example. (Or, better still, read the buildSearchConditions() function in ng-grid, its pretty clear on this).

### Search Entries in Multiple Columns

Searching multiple columns requires only a syntax extension of the search within a column. This syntax is:

filterText = '<displayName 1>:<lit 1>[|<lit 2>|..];<displayName 2>:<lit a>[|<lit b>|..][;..]'
The operative lexical element is the semicolon ';' that separates each column displayName.

Continuing on with this example, let's search for nyt or nvda on Oct 30th or Oct 31st. That looks like:

Logically, the filter searches (along Ticker for nyt OR nvda) AND (along Date for 10-30 OR 10-31).