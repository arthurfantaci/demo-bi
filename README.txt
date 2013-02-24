Usage notes:
============

1. The web app is only tested on on chrome/safari/FF on a mac. There can be bugs if run on IE.

2. To run the app, please load index.html directly from the disk and upload (or copy paste) input/world-pop.csv.
   All the external js/css/images are already in the project folders, so this will run offline as well.

3. The input is a csv file via file upload. HTML5 apis like FileReader has been used which is supported
   only on: IE 10, FF 3.6, Chrome 6.0 and Safari 6.0 among the major browsers (as per http://caniuse.com/filereader).
   For non supporting browsers the input method is pasting csv in a textarea.

4. Clicking anywhere on the line chart and dragging mouse will zoom it.

5. Clicking anywhere on the scatter chart and dragging mouse on points will select them and upon
   releasing mouse a log message will be shown in a dialog.


Libraries used:
===============

1. jQuery is used as the primary js library. jQuery-csv is used for parsing as there are quoted single data points
   having a comma inside. jQuery-ui is used for the widgets like tabs and dialogs.

2. Datatables (http://datatables.net/) is used for the tabular display of data.

3. Highcharts (http://www.highcharts.com/) is used for the charting. I must say this is an impressive library.


Design notes:
=============

1. There is a sanity check in csv parsing. If any row has less data than number of years, it is padded with zeroes
   at the end. If row has more, the extra data is spliced out.

2. Most of the time was spent on architecture, usability and maintainability and less time on styles.

3. A "rubber band lasso" is requested on the scatter plot, but I could not yet figure out the exact thing
   using highcharts. I did the feature as close as possible, and you have to drag the mouse directly over the points.
   I could spend some more time, but I already have taken a few days, so I decided to submit as is.
