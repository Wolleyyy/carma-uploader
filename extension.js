// SETUP INDUSTRIES, ADD A NEW INDUSTRY BY ADDING TO THE ARRAY BELOW 

const industries = [{name:"Advertising",value:"industry_0"}, {name:"arts & entertainment",value:"industry_1"},{name:"automotive",value:"industry_2"},{name:"aviation and aerospace",value:"industry_3"},{name:"company categories",value:"industry_4"},{name:"consumer products",value:"industry_5"},{name:"drinks & beverages",value:"industry_6"},{name:"e-commerce",value:"industry_7"},{name:"education",value:"industry_8"},{name:"electronics",value:"industry_9"},{name:"energy",value:"industry_10"},{name:"exhibitions & conferences",value:"industry_11"},{name:"fashion",value:"industry_12"},{name:"finance banking retail",value:"industry_13"},{name:"finance investment",value:"industry_14"},{name:"food manufacturers",value:"industry_15"},{name:"fragrances",value:"industry_16"},{name:"government",value:"industry_17"},{name:"hotels",value:"industry_18"},{name:"insurance",value:"industry_19"},{name:"international",value:"industry_20"},{name:"it",value:"industry_21"},{name:"news agencies",value:"industry_22"},{name:"ngos",value:"industry_23"},{name:"pharmaceutical",value:"industry_24"},{name:"quick foods",value:"industry_25"},{name:"real estate",value:"industry_26"},{name:"restaurants & cafe",value:"industry_27"},{name:"retail",value:"industry_28"},{name:"road & transportation",value:"industry_29"},{name:"satellite tv",value:"industry_30"},{name:"sports",value:"industry_31"},{name:"sunglasses",value:"industry_32"},{name:"tecom",value:"industry_33"},{name:"telecom and mobiles",value:"industry_34"},{name:"tobacco",value:"industry_35"},{name:"tourism",value:"industry_36"},{name:"transportation",value:"industry_37"},{name:"watches, jewellery and accessories",value:"industry_38"},{name:"water transportation & equipment",value:"industry_39"},{name:"women's products",value:"industry_40"}]


const industrySelected = document.getElementById("industrySelect")
// ADDING INDUSTRIES TO SELECT DYNAMICALLY
industries.forEach((el)=>{
	const option=document.createElement("option")
	option.value=el.value
	option.className="smallText"
	option.innerHTML= el.name.toUpperCase();
    industrySelected.appendChild(option);
})


// RESET PROJECT IF PROVIDER CHANGES
document.getElementById("provider").addEventListener("focus",()=>{
	document.getElementById("projectOptions").innerHTML=""
	document.getElementById("project-input").value=""
})

// THROTTLE TIMER TO REDUCE BODHI API CALLS
let timer = null;

// Call API TO GET ALL PROJECTS BASED ON QUERY & PROVIDER
const getProjects =()=>{
	clearTimeout(timer); 
	timer = setTimeout(async()=>{
		const provider = document.getElementById("provider").value;
		await fetch(`https://bodhi.carma.com/projects/available?analyze=undefined&q=${projectValue.value}&provider=${provider}`)
		.then(res=>res.json())
		.then(res=>{
			document.getElementById("projectOptions").innerHTML=""
			let projects=res.projects
			projects.forEach(element => {
				const option =document.createElement("option")
				option.value=element.id	
				option.innerHTML=`${element.name} <span >(${element.code})</span>`
				document.getElementById("projectOptions").appendChild(option)
			});	
		})
	},500)
}

const projectValue=document.getElementById("project-input")
projectValue.addEventListener("keyup",getProjects)

// Call BODHI API TO GET ALL KEYWORDS BASED ON QUERY
const getKeywords = ()=>{
	clearTimeout(timer); 
	timer = setTimeout(async()=>{
		await fetch(`https://bodhi.carma.com/articles/keywords`)
		.then(res=>res.json())
		.then(res=>{
			document.getElementById("keywordOptions").innerHTML=""
			let keywords = res;
			keywords.forEach(element=>{
				const option =document.createElement("option")
				option.value=element
				option.innerHTML=element;
				document.getElementById("keywordOptions").appendChild(option)
			})
		})
	}, 500)
	
}
const keywordValue=document.getElementById("keyword-input")
keywordValue.addEventListener("keyup",getKeywords)



// SEND URLS TO BACKGROUND SCRIPT WHERE IT WILL CREATE A NEW TAB FOR EACH URL
const sendUrl = (e) => {
	const selected = document.querySelectorAll('#industrySelect option:checked');
	const industries = Array.from(selected).map(el => el.value);
	
	if(!projectValue.value){
		return alert("Please enter a valid project")
	}else{
		e.preventDefault();
		const urlsToExtract = document.getElementById("url-textarea").value;
		const provider = document.getElementById("provider").value;
		chrome.runtime.sendMessage({
			msg: urlsToExtract,
			provider:provider,
			project:projectValue.value,
			keyword:keywordValue.value,
			industries
		});
	}
};
document.getElementById("btn").addEventListener("click", sendUrl);
