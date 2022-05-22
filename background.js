chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	const urlData = request.msg.split("\n");
	// FOREACH URL CREATES A NEW TAB AND SENDS URL TO EACH WHERE AN API CALL WILL HAPPEN TO EXTRACT DETAILS 
	for (const url of urlData) {
		// Regular expression to get website main domain without leading path
		urlHost = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(url);
		const hostname = urlHost[1];
		if (url == "") {
			continue;
		}
		await chrome.tabs.create(
			{
				url: "https://bodhi.carma.com/articles/new",
				active: false,
			},
			(tab) => {
				chrome.tabs.executeScript(
					tab.id,
					{
						file: "./content.js",
					},
					() => {
						chrome.tabs.sendMessage(tab.id, { 
							data: url, 
							hostname: hostname,
							provider:request.provider,
							project:request.project,
							keyword:request.keyword,
							industries:request.industries
					 	});
					}
				);
			}
		);
	}
});
