let page = 0
let pagination = 20
const words_filter_options = {
    "less": [1000,5000],
    "greater": [1000,5000,10000,20000,50000,100000,500000]
}
function loadData(element){
    emptyTable()
    $(element).addClass("is-active")
    $(element).siblings().removeClass("is-active")
    loadTable()
}

function loadTable(){
    progressBarVisible(true)
    $("#nodata-error").addClass("is-hidden")    
    let ind1 =  $("#selector1 .is-active").index()
    let ind2 =  $("#selector2 .is-active").index()
    $(".pagination-next").removeClass("is-invisible")
    $(".pagination-previous").removeClass("is-invisible")
    switch(ind1){
        case 0:
            $("#selector2").addClass("is-hidden")
            $("#filters").removeClass("is-hidden")
            loadLatestTable();
            break;
        case 1:
            $("#selector2").removeClass("is-hidden")
            $("#filters").removeClass("is-hidden")
            loadStoryTable($($("#selector2 a")[ind2]).text().replace(" ","").toLowerCase())
            break;
        case 2:
            $("#selector2").removeClass("is-hidden")
            $("#filters").addClass("is-hidden")
            loadAuthorTable($($("#selector2 a")[ind2]).text().replace(" ","").toLowerCase())
            break
    }
    
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
async function loadLatestTable(){
    $.getJSON(`/data/latest.json`).then((mData) => {
        
        mData = filterData(mData);
        if(pagination*(page+1) >= mData.length) $(".pagination-next").addClass("is-invisible")
        if(page==0) $(".pagination-previous").addClass("is-invisible")
        
        data = mData.slice(page*pagination,(page+1)*pagination)
        
        let headers = ["S.No","Story", "Status", "Words","Rating"]
        $("#data-table thead tr").html(headers.map(el=>{return `<th>${el}</th>`}))
        let rows = data.map((row)=>{            
            return `<tr>
                        <td>${mData.indexOf(row)+1}</td>
                        <td><a href="${row.story_url}" target="_blank">${row.story_name}</a> - <a href="${row.author_url}" target="_blank"><i>${row.author_name}</i></a> [${row.website}]
                            <p>
                                ${row.language !== null ? `<span><strong class="fas fa-globe-asia"></strong>${row.language}</span>` : ""}
                                ${row.genre !== null ? `<span><strong class="fas fa-pen"></strong>${row.genre}</span>`: ""}
                                ${row.chapters !== null ? `<span><strong class="fas fa-book"></strong>${row.chapters}</span>`: ""}
                                ${row.reviews !== null ? `<span><strong class="fas fa-comment"></strong>${row.reviews}</span>`: ""}
                                ${row.favs !== null ? `<span><strong class="fas fa-heart"></strong>${row.favs}</span>`: ""}
                                ${row.follows !== null ? `<span><strong class="fas fa-bookmark"></strong>${row.follows}</span>`: ""}
                            </p>
                            <p>
                            ${row.published !== null ? `<span><strong class="fas fa-clock"></strong>${getFullDate(row.published)}</span>`: ""}
                            ${row.updated !== null ? `<span><strong class="fas fa-sync"></strong>${getFullDate(row.updated)}</span>` : ""}
                            </p>
                            <p>
                            ${row.characters!==null ? row.characters.replace(/</g, '&lt;').replace(/>/g, '&gt;'): ""}
                            </p>
                        </td>
                        <td>${row.status ? row.status : "N/A"}</td>
                        <td>${row.words ? abbr(row.words,1) : "N/A"}</td>
                        <td>${row.rated ? row.rated : "N/A"}</td>
                    </tr>`
        })
        progressBarVisible(false)

        $("#data-table tbody").html(rows)

        if(rows.length === 0){
            $("#nodata-error").removeClass("is-hidden")
        }

    });
}

async function loadStoryTable(duration){
    $.getJSON(`/data/stories_top100_${duration}.json`).then((mData) => {
        mData = filterData(mData);
        if(pagination*(page+1) >= mData.length) $(".pagination-next").addClass("is-invisible")
        if(page==0) $(".pagination-previous").addClass("is-invisible")
        
        data = mData.slice(page*pagination,(page+1)*pagination)
        
        let headers = ["S.No","Count","Story", "Status", "Words","Rating"]
        $("#data-table thead tr").html(headers.map(el=>{return `<th>${el}</th>`}))
        let rows = data.map((row)=>{
            return `<tr>
                        <td>${mData.indexOf(row)+1}</td>
                        <td>${row.count}</td>
                        <td><a href="${row.story_url}" target="_blank">${row.story_name}</a> - <a href="${row.author_url}" target="_blank"><i>${row.author_name}</i></a> [${row.website}]
                            <p>
                            ${row.language !== null ? `<span><strong class="fas fa-globe-asia"></strong>${row.language}</span>`:""}
                            ${row.genre !== null ? `<span><strong class="fas fa-pen"></strong>${row.genre}</span>`:""}
                            ${row.chapters !== null ? `<span><strong class="fas fa-book"></strong>${row.chapters}</span>`:""}
                            ${row.reviews !== null ? `<span><strong class="fas fa-comment"></strong>${row.reviews}</span>`:""}
                            ${row.favs !== null ? `<span><strong class="fas fa-heart"></strong>${row.favs}</span>`:""}
                            ${row.follows !== null ? `<span><strong class="fas fa-bookmark"></strong>${row.follows}</span>`:""}
                            </p>
                            <p>
                            ${row.published !== null ? `<span><strong class="fas fa-clock"></strong>${getFullDate(row.published)}</span>`:""}
                            ${row.updated !== null ? `<span><strong class="fas fa-sync"></strong>${getFullDate(row.updated)}</span>`:""}
                            </p>
                            <p>
                            ${row.characters!==null ? row.characters.replace(/</g, '&lt;').replace(/>/g, '&gt;'):""}
                            </p>
                        </td>
                        <td>${row.status ? row.status : "N/A"}</td>
                        <td>${row.words ? abbr(row.words,1) : "N/A"}</td>
                        <td>${row.rated ? row.rated : "N/A"}</td>
                    </tr>`
        })
        progressBarVisible(false)

        $("#data-table tbody").html(rows)
        if(rows.length === 0){
            $("#nodata-error").removeClass("is-hidden")
        }
    });
}

async function loadAuthorTable(duration){
    $.getJSON(`/data/authors_top100_${duration}.json`).then((mData) => {
        if(pagination*(page+1) >= mData.length) $(".pagination-next").addClass("is-invisible")
        if(page==0) $(".pagination-previous").addClass("is-invisible")
        data = mData.slice(page*pagination,(page+1)*pagination)
        let headers = ["S.No","Count", "Author", "Website"]
        $("#data-table thead tr").html(headers.map(el=>{return `<th>${el}</th>`}))
        let rows = data.map((row)=>{
            return `<tr>
                        <td>${mData.indexOf(row)+1}</td>
                        <td>${row.count}</td>                        
                        <td><a href="${row.author_url}" target="_blank">${row.author_name}</a></td>
                        <td>${row.website}</td>
                    </tr>`
        })
        progressBarVisible(false)
        $("#data-table tbody").html(rows)
        if(rows.length === 0){
            $("#nodata-error").removeClass("is-hidden")
        }
    });
}
function loadFilters(){
    
    status_filters = ["Status: All","Complete","Incomplete"]
    rating_filters = ["Rating: All","Fiction K","Fiction K+","Fiction T","Fiction M"]
    website_filters = ["Website: All","fanfiction.net","archiveofourown.org","fictionpress.com","hpfanficarchive.com"]
    let character_data;
    $.getJSON("/data/genre_filters.json",function(data){
        genre_filters = ["Genre: All", ...data]
        for(let filter of genre_filters){
            $("#filter_genre").append(`<option>${filter}</option>`)
        }
    })
    $.getJSON("/data/character_filters.json",function(data){
        character_data = data;
        character_filters = ["Pairing: All", ...Object.keys(data)]
        for(let filter of character_filters){
            $("#filter_pairing1").append(`<option>${filter}</option>`)
        }
        $("#filter_pairing2").append(`<option>${" "}</option>`)

    })
    words_filters = ["<option>Words: All</option>",
    ...words_filter_options['less'].map(option => {
        return `<option>< ${abbr(option,1)}</option>`
    }),
    ...words_filter_options['greater'].map(option => {
        return `<option>> ${abbr(option,1)}</option>`
    })
    ]
    for(let filter of words_filters){
        $("#filter_words").append(filter)
    }
    for(let filter of status_filters){
        $("#filter_status").append(`<option>${filter}</option>`)
    }
    for(let filter of rating_filters){
        $("#filter_rating").append(`<option>${filter}</option>`)
    }
    for(let filter of website_filters){
        $("#filter_website").append(`<option>${filter}</option>`)
    }
    $("#filters .change").on('change',function(){
        page = 0;
        loadTable();
    })
    $("#filter_pairing1").on('change',function(){
        select = $("#filter_pairing1")[0];
        $("#filter_pairing2").text("")
        console.log(select)
        if(select.selectedIndex > 0){
            key = select.selectedOptions[0].innerText
            for(let character of ["Pairing: All", ...character_data[key]]){
                $("#filter_pairing2").append(`<option>${character}</option>`)
            }
        }
    })
}

function filterData(data){
    returnData = []
    filters = []
    $("#filters select").each((value,s)=>{
        filters.push({
            "index":s.selectedIndex,
            "option":s.selectedOptions[0].innerText
        })
    });
    for(let row of data){
        if(checkFilterWords(row,filters) && 
        checkFilterGenre(row,filters) && 
        checkFilterPairing(row,filters) &&
        checkFilterRating(row,filters) && 
        checkFilterStatus(row,filters) &&
        checkFilterWebsite(row,filters)) {
            returnData.push(row)
        }
    }
    return returnData
}

function checkFilterWords(data,filters){
    if(filters[0].index !== 0 && !data.words) return false
    if((filters[0].index == 1 || filters[0].index == 2) && data.words > parseInt(words_filter_options['less'][filters[0].index-1])) return false
    if(filters[0].index > 2 && data.words < parseInt(words_filter_options['greater'][filters[0].index-3])) return false
    return true
}
function checkFilterGenre(data,filters){
    if(filters[1].index !== 0 && !data.genre) return false
    if(filters[1].index > 0 && !data.genre.includes(filters[1].option)) return false
    return true
}
function checkFilterPairing(data,filters){
    if(filters[2].index === 0) return true;
    if(data.characters === null) return false;
    if(data.characters.includes("<") && data.characters.includes(">")){
    pairings = data.characters.substring(data.characters.indexOf("<")+1,data.characters.indexOf(">"))
    if(pairings.length > 1){
        if(filters[2].index > 0 && pairings.includes(filters[2].option)){
            if(filters[3].index > 0){
                if(pairings.includes(filters[3].option)){
                    return true
                }
            }
            else{
                return true;
            }        
        }
    }
    }
    return false;
}
function checkFilterRating(data,filters){
    if(filters[4].index !== 0 && !data.rated) return false
    if(filters[4].index > 0 && data.rated !== filters[4].option) return false
    return true
}
function checkFilterStatus(data,filters){
    if(filters[5].index === 1 && !data.status) return false
    if(filters[5].index === 2 && data.status) return false
    return true
}
function checkFilterWebsite(data,filters){
    if(filters[6].index !== 0 && !data.website) return false
    if(filters[6].index > 0 && data.website !== filters[6].option) return false
    return true
}
function emptyTable(){
    $("#data-table thead tr").html("")
    $("#data-table tbody").html("")
    page = 0
}

function turnPage(i){
    page += i
    loadTable()
}

function changeLimit(limit){
    pagination = limit;
    loadTable();
}

function loadStats(){
    $.getJSON("/data/stats.json").then(data=>{
        stats = data[0];
        for(let key of Object.keys(stats)){
            $("#"+key).html(stats[key])
        }
        let d =new Date(parseInt(stats.latest_run)*1000)
        $("#latest_utc").html(`${d.toLocaleString()}`)
        $("#storydata_perc").html(Math.round(stats['storydata_count']*100/stats['total_unique_stories']*100)/100+"%")
    });
}


function getFullDate(date){
    return new Date(parseInt(date)*1000).toLocaleDateString();
}
function abbr(number, decPlaces) {
    // Source: https://stackoverflow.com/a/2686098/4698800
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "k", "m", "b", "t" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
}
function progressBarVisible(visible){
    progress = $("#data-table progress")
    if(visible){
        progress.removeClass("is-hidden")
    }
    else{
        progress.addClass("is-hidden")
    }
}

function messageVisible(elem){
    message = $(elem).closest("article").children(".message-body")
    if(message.hasClass("is-hidden")){
        message.removeClass("is-hidden")
    }
    else {
        message.addClass("is-hidden")
    }
}
$(document).ready(function(){
    loadStats();
    loadTable();
    loadFilters();
})