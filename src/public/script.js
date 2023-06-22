
let state = {
    fileContents: [],
    pageSize: 1000,
    isLoading: false
}

function createLink(name, onclick) {
    let a = document.createElement("a");
    a.href = "#";
    a.onclick = onclick;
    a.appendChild(document.createTextNode(name));
    return a;
}

function wrapInDiv(element) {
    let div = document.createElement("div");
    div.appendChild(element);
    return div;
}

function updateFileExplorer(path, dirContents) {
    document.getElementById("explorer").innerHTML = "";
    document.getElementById("currentPath").innerHTML = dirContents.path;

    if (path && path != "") {
        const dirStack = path.split("/");
        dirStack.pop();
        let upOne = dirStack.join("/");
        let onclick = function () {
            listDirectory(upOne);
        };

        document.getElementById("explorer").appendChild(wrapInDiv(createLink(`🗀 ..`, onclick)));
    }

    const dirs = dirContents.dirs;

    for (let i = 0; i < dirs.length; i++) {
        let onclick = function () {
            listDirectory(`${path}/${dirs[i].name}`);
        };
        document.getElementById("explorer").appendChild(wrapInDiv(createLink(`🗀 ${dirs[i].name}`, onclick)));
    }

    const files = dirContents.files;
    for (let i = 0; i < files.length; i++) {
        let onclick = function () {
            getFileContents(`${path}/${files[i].name}`);
        };
        document
            .getElementById("explorer")
            .appendChild(wrapInDiv(createLink(`🗎 ${files[i].name} (${files[i].size})`, onclick)));
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function clearFileContentsText() {
    document.getElementById("fileContentsText").textContent = "";
}

function updatePagination(page) {
    // Clear file contents and page info
    if (page == null || page == undefined) {
        document.getElementById("pagination").innerHTML = "Page 1/1";
        return;
    }

    const start = state.pageSize * page;
    const pages = Math.ceil(state.fileContents.length / state.pageSize);
    document.getElementById("pagination").innerHTML = `Page ${page + 1}/${pages}`;

    document.getElementById("fileContentsText").textContent = "";
    document.getElementById("fileContentsText").textContent = state.fileContents.slice(start, start + state.pageSize).join('\n');
}

function getFileContents(path) {
    if (!path || path === "") return;
    
    state.fileContents = [];
    document.getElementById("fileContentsText").textContent = "Loading";
    document.getElementById("fileName").textContent = path;

    const xhttp = new XMLHttpRequest();
    const encoded = encodeURI(path);
    xhttp.open("GET", `http://localhost:3100/logs/${encoded}`, true);
    xhttp.send();
    xhttp.onload = function () {
        let resp = xhttp.responseText;

        let respLines = resp.split('\n');

        if (respLines.length > state.pageSize) {
            state.fileContents = respLines;
            updatePagination(0);
        } else {
            updatePagination();
            document.getElementById("fileContentsText").textContent = resp;
        }
    };
}

function listDirectory(path) {
    const xhttp = new XMLHttpRequest();

    // Reset the error
    document.getElementById("error").innerHTML = "";

    // Make the request
    const encoded = path ?? encodeURI(path);
    xhttp.open("GET", `http://localhost:3100/logs/${encoded}`, true);
    xhttp.onerror = function (err) {
        console.log("ERROR");
        alert("Error: " + err);
    };
    xhttp.onload = function () {
        console.log(xhttp.status);
        if (xhttp.status === 200) {
            let resp = JSON.parse(xhttp.responseText);
            updateFileExplorer(path, resp);
        } else {
            document.getElementById("error").innerHTML = xhttp.responseText;
        }
    };
    xhttp.send();
}
