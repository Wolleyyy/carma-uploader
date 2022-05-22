const token = "50aa7aa3ff37ae37b45888e942207017";
const apiUrl = "https://api.diffbot.com/v3/article";


// Converts Date from string to YYYY-MM-DD Format
function convert(str) {
	var date = new Date(str),
	  mnth = ("0" + (date.getMonth() + 1)).slice(-2),
	  day = ("0" + date.getDate()).slice(-2);
	return [date.getFullYear(), mnth, day].join("-");
  }


chrome.runtime.onMessage.addListener(async function (
	request,
	sender,
	sendResponse
) {
	const provider = request.provider;
	const project = request.project;
	const keyword = request.keyword;
	const industries = request.industries;
	//if www. since online outlets with www. domain are not included ie www.bloomberg.com --> on Bodhi listed as Bloomberg.com
	const outletUrl = request.hostname.replace("www.", "");
	let outletId;
	let outletLang;
	let outletCountry;

	try {
		await fetch(`https://bodhi.carma.com/outlets?q=${outletUrl}&media_types=website%2Cblogs`)
		.then((response) => response.json())
		.then((data) => {
			if (data.outlets.length === 0){
				alert(`${outletUrl} is not available, please add to proceed`) 
			}else{
				for (const outlet of data.outlets) {
					if (outlet.url === outletUrl) {
						outletId = outlet.id;					
						outletLang = outlet.languages[0];				
						outletCountry = outlet.location.country_code;					
						return fetchArticle(request,outletId,outletLang,outletCountry,provider,project,keyword)
					}
				}
			} 
		})
	} catch (err) {
		// console.log(err);
		alert(err);
	}
});


const fetchArticle=async(request,outletId,outletLang,outletCountry,provider,project,keyword)=>{
	try {
		await fetch(apiUrl +`?token=${token}&url=${encodeURIComponent(request.data)}&paging=false&discussion=false`)
		.then((response) => response.json())
		.then((data) => {
			let articleDate
			if( data.objects[0].date){ 
				articleDate = convert(data.objects[0].date)
			}else{			
				const date= new Date() 
				articleDate= `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
				alert("check date")
			}
			if(request.industries.length!==0){
				request.industries.forEach(element => {
				return document.getElementById(element).checked=true	
				});
			}			
			const currentTimeMs=new Date().getTime()
			const articleUrl = data.objects[0].pageUrl;
			const articleText = data.objects[0].text;
			const countryField = document.getElementById("article_country").innerHTML=`<option value=${outletCountry} selected="selected"></option`;
			const outletField = document.getElementById("article_outlet_id").innerHTML=`<option value=${outletId} selected="selected"></option`; ;	
			const providerField = document.getElementById("article_provider_name").value=provider;
			const dateField = document.getElementById("article_published_at").value=articleDate;
			const languageSelect = document.createElement("select")
			languageSelect.name = "article[language]";
			languageSelect.id = "article_language";
			languageSelect.innerHTML=`<option value=${outletLang} selected="selected"></option>`;
			const languageFields = document.getElementById("section-fields").appendChild(languageSelect);
			const fullText = document.getElementById("article_content_plain").value= articleText;
			const urlValue = document.getElementById("metadata").innerHTML=`<input type="text" name="article[url]" id="article_url" value=${articleUrl}></input>`;
			const articleHeadline = document.getElementById("article_headline").value = data.objects[0].title;
			const keywordSelect = document.getElementById("article_keywords").innerHTML=`<option value="${keyword}" selected="selected"></option>`;

			// Useless form requests
			const file = document.getElementsByClassName("item-container large")[0].innerHTML=""
			// Useless form requests

			const Project = document.getElementsByClassName("codings")[0].innerHTML=
			`
				<input class="coding_project_id" type="hidden" name="article[codings_attributes][${currentTimeMs}][project_id]" id="article_codings_attributes_${currentTimeMs}_project_id" value=${project}>
				<input name="article[codings_attributes][${currentTimeMs}][sentiment]" value="neutral" id="article_codings_attributes_${currentTimeMs}_neutral" class="sentiment_input" type="radio" data-label="Neutral">
				<textarea class="text optional" name="article[codings_attributes][${currentTimeMs}][summary]" id="article_codings_attributes_${currentTimeMs}_summary"></textarea>
				<input type="hidden" value="false" name="article[codings_attributes][${currentTimeMs}][_destroy]" id="article_codings_attributes_${currentTimeMs}__destroy">
			`
			const sentimentButton = document.querySelector(`#article_codings_attributes_${currentTimeMs}_neutral`)
			sentimentButton.checked = true;
			document.getElementById("submit-article").click();
		})
	}catch(err){
		console.log(err)
	}
}
