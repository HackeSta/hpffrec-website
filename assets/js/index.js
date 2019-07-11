let page = 0
let pagination = 20
function loadData(element){
    emptyTable()
    $(element).addClass("is-active")
    $(element).siblings().removeClass("is-active")
    loadTable()
}

function loadTable(){
    let ind1 =  $("#selector1 .is-active").index()
    let ind2 =  $("#selector2 .is-active").index()
    $(".pagination-next").removeClass("is-invisible")
    $(".pagination-previous").removeClass("is-invisible")
    switch(ind1){
        case 0:
            $("#selector2").addClass("is-hidden")
            loadLatestTable();
            break;
        case 1:
            $("#selector2").removeClass("is-hidden")
            loadStoryTable($($("#selector2 a")[ind2]).text().replace(" ","").toLowerCase())
            break;
        case 2:
            $("#selector2").removeClass("is-hidden")
            loadAuthorTable($($("#selector2 a")[ind2]).text().replace(" ","").toLowerCase())
            break
    }
}
function loadLatestTable(){
    $.getJSON(`/data/latest.json`).then((mData) => {
        if(pagination*(page+1) >= mData.length) $(".pagination-next").addClass("is-invisible")
        if(page==0) $(".pagination-previous").addClass("is-invisible")
        
        data = mData.slice(page*pagination,(page+1)*pagination)
        
        let headers = ["S.No","Story", "Status", "Words","Rating"]
        $("#data-table thead tr").html(headers.map(el=>{return `<th>${el}</th>`}))
        let rows = data.map((row)=>{
            console.log(row)
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
                            ${row.characters!==null ? row.characters: ""}
                            </p>
                        </td>
                        <td>${row.status ? row.status : "N/A"}</td>
                        <td>${row.words ? abbr(row.words,1) : "N/A"}</td>
                        <td>${row.rated ? row.rated : "N/A"}</td>
                    </tr>`
        })
        $("#data-table tbody").html(rows)

    });
}

function loadStoryTable(duration){
    $.getJSON(`/data/stories_top100_${duration}.json`).then((mData) => {
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
                            ${row.characters!==null ? row.characters:""}
                            </p>
                        </td>
                        <td>${row.status ? row.status : "N/A"}</td>
                        <td>${row.words ? abbr(row.words,1) : "N/A"}</td>
                        <td>${row.rated ? row.rated : "N/A"}</td>
                    </tr>`
        })
        $("#data-table tbody").html(rows)

    });
}

function loadAuthorTable(duration){
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
        $("#data-table tbody").html(rows)

    });
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
        let d =new Date(parseInt(stats.latest_utc)*1000)
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
$(document).ready(function(){
    loadStats();
    loadTable();
})