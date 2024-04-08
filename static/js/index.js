
var intervalID
var nodeNameList = ['c1-master', 'gpu-node1', 'gpu-node2', 'cpu-node1']
var selectedNodeName = nodeNameList[1]

const gpuDetail = document.getElementById('gpuDetail');

document.addEventListener("DOMContentLoaded", function () {
    gpuDetail.textContent = "GPU Detail (Selected Node: " + selectedNodeName + ")"
    document.getElementById(`${selectedNodeName}`).style.backgroundColor = "yellow"

    getLatestMultiMetric();
    startInterval();
});

function getLatestMultiMetric(){
    fetch('/update', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
    })
    .then(response => response.json())
    .then(data => updateMultiMetric(data))
}

function updateMultiMetric(data){
    nodeNameList.forEach(className => {
        multiMetric = data['MultiMetrics']
        // console.log(multiMetric)
        var nodeMetric = multiMetric[className]
        var gpu = document.querySelectorAll(`.${className}.gpu`);
        if(nodeMetric["gpu_count"]){
            gpu[0].textContent = "GPU : " + nodeMetric["gpu_count"]
        }else{
            gpu[0].textContent = "GPU : 0"
        }
        var cpu = document.querySelectorAll(`.${className}.cpu`);
        cpu[0].textContent = "CPU (Used/Total) : " + nodeMetric["node_metric"]["milli_cpu_usage"] + " / " + nodeMetric["node_metric"]["milli_cpu_total"]
        var memory = document.querySelectorAll(`.${className}.memory`);
        memory[0].textContent = "Memory (Used/Total) : " + nodeMetric["node_metric"]["memory_usage"] + " / " + nodeMetric["node_metric"]["memory_total"]
        var storage = document.querySelectorAll(`.${className}.storage`);
        storage[0].textContent = "Storage (Used/Total) : " + nodeMetric["node_metric"]["storage_usage"] + " / " + nodeMetric["node_metric"]["storage_total"]
        var network = document.querySelectorAll(`.${className}.network`);
        network[0].textContent = "Network (RX/TX) : " + nodeMetric["node_metric"]["network_rx"] + " / " + nodeMetric["node_metric"]["network_tx"]
    });

    var gpuMetric = multiMetric[selectedNodeName]["gpu_metrics"]

    for(gpu in gpuMetric){
        if(gpuMetric[gpu]["index"] == undefined){
            index = 0
        }else{
            index = 1
        }
        
        if(index == 0){
            var firstGPUTd = document.querySelectorAll('div.firstGPU td');
            firstGPUTd[0].textContent = index
            firstGPUTd[1].textContent = gpuMetric[gpu]["gpu_name"]
            firstGPUTd[2].textContent = gpu
            firstGPUTd[3].textContent = gpuMetric[gpu]["architecture"]
            firstGPUTd[4].textContent = gpuMetric[gpu]["cudacore"]
            firstGPUTd[5].textContent = gpuMetric[gpu]["max_clock"]
            firstGPUTd[6].textContent = gpuMetric[gpu]["bandwidth"]
            firstGPUTd[7].textContent = gpuMetric[gpu]["energy_consumption"]
            firstGPUTd[8].textContent = gpuMetric[gpu]["memory_used"] + " / " + gpuMetric[gpu]["memory_total"]
            firstGPUTd[9].textContent = gpuMetric[gpu]["power_used"]
            firstGPUTd[10].textContent = gpuMetric[gpu]["temperature"]
            memory = gpuMetric[gpu]["memory_used"] / gpuMetric[gpu]["memory_total"] * 100 / 10
            firstGPUTd[11].innerHTML = makeUtilizationInnerHTML(memory)
            if(gpuMetric[gpu]["utilization"] === undefined){
                idle = 0
            }else{
                var utilization = gpuMetric[gpu]["utilization"]
                idle = utilization / 10
            }
            firstGPUTd[12].innerHTML = makeUtilizationInnerHTML(idle)
            if(gpuMetric[gpu]["pod_count"] === undefined){
                pod = 0
            }else{
                pod = gpuMetric[gpu]["pod_count"]
            }
            firstGPUTd[13].innerHTML = makePodsInnerHTML(pod)

        }else{
            var secondGPUTd = document.querySelectorAll('div.secondGPU td');
            secondGPUTd[0].textContent = index
            secondGPUTd[1].textContent = gpuMetric[gpu]["gpu_name"]
            secondGPUTd[2].textContent = gpu
            secondGPUTd[3].textContent = gpuMetric[gpu]["architecture"]
            secondGPUTd[4].textContent = gpuMetric[gpu]["cudacore"]
            secondGPUTd[5].textContent = gpuMetric[gpu]["max_clock"]
            secondGPUTd[6].textContent = gpuMetric[gpu]["bandwidth"]
            secondGPUTd[7].textContent = gpuMetric[gpu]["energy_consumption"]
            secondGPUTd[8].textContent = gpuMetric[gpu]["memory_used"] + " / " + gpuMetric[gpu]["memory_total"]
            secondGPUTd[9].textContent = gpuMetric[gpu]["power_used"]
            secondGPUTd[10].textContent = gpuMetric[gpu]["temperature"]
            memory = gpuMetric[gpu]["memory_used"] / gpuMetric[gpu]["memory_total"] * 100 / 10
            secondGPUTd[11].innerHTML = makeUtilizationInnerHTML(memory)
            if(gpuMetric[gpu]["utilization"] == undefined){
                idle = 0
            }else{
                var utilization = gpuMetric[gpu]["utilization"]
                idle = utilization / 10
            }
            secondGPUTd[12].innerHTML = makeUtilizationInnerHTML(idle)
            if(gpuMetric[gpu]["pod_count"] === undefined){
                pod = 0
            }else{
                pod = gpuMetric[gpu]["pod_count"]
            }
            secondGPUTd[13].innerHTML = makePodsInnerHTML(pod)
        }
    }
}

function makeUtilizationInnerHTML(idle){
    var utilizationInnerHTML = `<div class="row row-deck row-cards">`
    
    for(let i = 0; i<10; i++){
        if(i<idle){
            utilizationInnerHTML += `
                <div class="col-2" style="max-width: 1.5rem; max-height: 1.5rem; padding: 0rem; margin-left: 0.5rem;">
                    <img src="../static/image/gpuAllocated.png">
                </div> `
        }else{
            utilizationInnerHTML += `
                <div class="col-2" style="max-width: 1.5rem; max-height: 1.5rem; padding: 0rem; margin-left: 0.5rem;">
                    <img src="../static/image/gpuIdle.png">
                </div> `
        }
    }
    utilizationInnerHTML += `</div>`

    return utilizationInnerHTML
}

function makePodsInnerHTML(pod){
    var podsInnerHTML = `<div class="row row-deck row-cards">`
    
    for(let i = 0; i<pod; i++){
        podsInnerHTML += `
        <div class="col-2" style="max-width: 1.5rem; max-height: 1.5rem; padding: 0rem; margin-left: 0.5rem;">
                <img src="../static/image/hexagon.png">
            </div> `
    }
    podsInnerHTML += `</div>`

    return podsInnerHTML
}

const nodeBtn = document.querySelectorAll('.nodeBtn');
nodeBtn.forEach((target) => target.addEventListener("click", () => {
    var originSelectedNodeName = selectedNodeName
    if(selectedNodeName != target.id){
        selectedNodeName = target.id
        document.getElementById(`${originSelectedNodeName}`).style.backgroundColor = ""
        gpuDetail.textContent = "GPU Detail (Selected Node: " + selectedNodeName + ")"
        document.getElementById(`${selectedNodeName}`).style.backgroundColor = "yellow"
    }
    
}));

function startInterval(){
    intervalID = setInterval(getLatestMultiMetric,3000);
}
