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
        
        let headers = ["S.No","Story", "Author", "Website"]
        $("#data-table thead tr").html(headers.map(el=>{return `<th>${el}</th>`}))
        let rows = data.map((row)=>{
            return `<tr>
                        <td>${mData.indexOf(row)+1}</td>
                        <td><a href="${row.story_url}" target="_blank">${row.story_name}</a></td>
                        <td><a href="${row.author_url}" target="_blank">${row.author_name}</a></td>
                        <td>${row.website}</td>
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
        let headers = ["S.No","Count","Story", "Author", "Website"]
        $("#data-table thead tr").html(headers.map(el=>{return `<th>${el}</th>`}))
        let rows = data.map((row)=>{
            return `<tr>
                        <td>${mData.indexOf(row)+1}</td>
                        <td>${row.count}</td>                        
                        <td><a href="${row.story_url}" target="_blank">${row.story_name}</a></td>
                        <td><a href="${row.author_url}" target="_blank">${row.author_name}</a></td>
                        <td>${row.website}</td>
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

function loadStats(){
    $.getJSON("/data/stats.json").then(data=>{
        stats = data[0];
        console.log(stats)
        for(let key of Object.keys(stats)){
            $("#"+key).html(stats[key])
        }
        let d =new Date(parseInt(stats.latest_utc)*1000)
        $("#latest_utc").html(`${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`)
    });
}

$(document).ready(function(){
    loadStats();
    loadTable();
})