function timeTest() {
  const startDate = new Date();
  const startTime = startDate.getTime();
  for (let i = 0; i < 1000000; i++) {
    checkForWin(25);
  }
  const endDate = new Date();
  const endTime = endDate.getTime();

  const slowstartDate = new Date();
  const slowstartTime = slowstartDate.getTime();
  for (let i = 0; i < 1000000; i++) {
    slowCheckForWin();
  }
  const slowendDate = new Date();
  const slowendTime = slowendDate.getTime();

  console.log(`Smart search:         ${endTime - startTime}`);
  console.log(`Dumb big search:   ${slowendTime - slowstartTime}`);
  console.log((slowendTime - slowstartTime) / (endTime - startTime));
}
