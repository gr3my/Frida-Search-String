function searchString(target, dumpLen) {
  dumpLen = dumpLen || 1024;

  var pattern = target
    .split('')
    .map(function(c) {
      return c.charCodeAt(0).toString(16).padStart(2, '0');
    })
    .join(' ');

  var results = [];

  Process.enumerateRanges('r--').forEach(function(range) {
    try {
      var matches = Memory.scanSync(range.base, range.size, pattern);

      matches.forEach(function(m) {
        results.push(m.address);
      });
    } catch (e) {}
  });

  console.log("found " + results.length + " matches for '" + target + "'");

  results.forEach(function(addr) {
    console.log("\n--- " + addr + " ---");

    try {
      console.log(addr.readCString(dumpLen));
    } catch (e) {
      console.log("(couldn't read: " + e + ")");
    }
  });

  return results;
}

searchString("x-mothership-", 1024);