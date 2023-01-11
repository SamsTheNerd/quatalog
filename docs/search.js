const displaySearchTerm = () => {
    document.getElementById("searchTerm").innerHTML = '"' + ccode.replaceAll("+", " ").toLowerCase() + '"';
}


var makeCourseHTML = (courseCode, score) => {
    var thisCourse = catalog[courseCode];
    return `
    <div class="courseContainer" onclick="gotoCourse('${courseCode}')">
        <div class="courseShelf">
            <span class="courseName">${thisCourse.name}</span> • <span class="courseCode">${courseCode}</span>
        </div>
        <div class="attrs"></div>
        <div class="description">${thisCourse.description}</div>
    </div>
    `
}

const searchConfig = {
    includeScore: true,
    ignoreLocation: true,
    useExtendedSearch: true,
    threshold: 0.01,
    keys: [
        {
            name: 'fullCode',
            weight: 0.15
        },
        {
            name: 'name',
            weight: 0.7
        },
        {
            name: 'description',
            weight: 0.15
        }
    ]
}
const searchConfigFuzzy = {
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.1,
    keys: [
        {
            name: 'fullCode',
            weight: 0.15
        },
        {
            name: 'name',
            weight: 0.7
        },
        {
            name: 'description',
            weight: 0.15
        }
    ]
}

var fuzzySearchCourses = (searchInput) => {
    const fuse = new Fuse(searchableCatalog, searchConfig);
    console.log(`searching for ${searchInput}...`);
    // return fuse.search(`="${searchInput}"`);
    var includeResults = fuse.search(`'"${searchInput}"`);
    if(includeResults.length > 0){
        return includeResults;
    } else {
        const fuzzyFuse = new Fuse(searchableCatalog, searchConfigFuzzy);
        return fuzzyFuse.search(searchInput);
    }
}

var showSearchResults = () => {
    var searchResults = fuzzySearchCourses(ccode.replaceAll("+", " ").toLowerCase());
    var validResults = [];
    for(var i = 0; i < 20; i++){
        var thisResult = searchResults[i];
        if(thisResult){
            var thisCourse = thisResult.item;
            var thisCourseCode = thisCourse.fullCode;
            if(thisResult.score > 0.2){
                // break;
            }
            validResults.push(thisResult);
            // document.getElementById("searchResultsContainer").innerHTML += makeCourseHTML(thisCourseCode, thisResult.score);
        }
    }
    // show the closest matches first but otherwise sort by course code
    validResults.sort((a,b)=>{
        if(a.score - b.score > 0.05){
            return 1;
        } else if(b.score - a.score > 0.05){
            return -1;
        }
        return a.item.crse > b.item.crse;
    })
    for(var i = 0; i < validResults.length; i++){
        var thisResult = validResults[i];
        var thisCourse = thisResult.item;
        var thisCourseCode = thisCourse.fullCode;
        document.getElementById("searchResultsContainer").innerHTML += makeCourseHTML(thisCourseCode, thisResult.score);
    }
}

window.onload = async () =>{
    await loadData();
    displaySearchTerm();
    showSearchResults();
}