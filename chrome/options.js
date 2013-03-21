// Saves options to localStorage.
function save_options() {
  alert('hi');
  var select = document.getElementById("readlater");
  var color = select.children[select.selectedIndex].value;
  localStorage["readlater"] = readlater;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);