function tinyImgUpload(ele, options) {
  var eleList = document.querySelectorAll(ele);
  if (eleList.length == 0) {
    console.log('绑定的元素不存在');
    return;
  } else if (eleList.length > 1) {
    console.log('请绑定唯一元素');
    return;
  } else {
    eleList[0].innerHTML = '<div id="img-container" >' +
      '<div class="img-up-add  img-item"> <span class="img-add-icon" style="color: #cccccc">+</span> </div>' +
      '<input type="file" name="files" id="img-file-input" multiple>' +
      '</div>';
    var ele = eleList[0].querySelector('#img-container');
    ele.files = [];
  }

  var addBtn = document.querySelector('.img-up-add');
  addBtn.addEventListener('click', function () {
    document.querySelector('#img-file-input').value = null;
    document.querySelector('#img-file-input').click();
    return false;
  }, false)

  function handleFileSelect(evt) {
    var files = evt.target.files;

    for (var i = 0, f; f = files[i]; i++) {
      if (!f.type.match('image.*')) {
        continue;
      }
      var tip = false;
      for (var j = 0; j < (ele.files).length; j++) {
        if ((ele.files)[j].name == f.name) {
          tip = true;
          break;
        }
      }
      if (!tip) {
        ele.files.push(f);

        var reader = new FileReader();
        reader.onload = (function (theFile) {
          return function (e) {
            var oDiv = document.createElement('div');
            oDiv.className = 'img-thumb img-item';
            oDiv.innerHTML = '<img class="thumb-icon" src="' + e.target.result + '" />' +
              '<a href="javscript:;" class="img-remove">x</a>'

            ele.insertBefore(oDiv, addBtn);
          };
        })(f);

        reader.readAsDataURL(f);
        uploadImg();
      }
    }
  }

  document.querySelector('#img-file-input').addEventListener('change', handleFileSelect, false);

  function removeImg(evt) {
    if (evt.target.className.match(/img-remove/)) {
      function getIndex(ele) {

        if (ele && ele.nodeType && ele.nodeType == 1) {
          var oParent = ele.parentNode;
          var oChilds = oParent.children;
          for (var i = 0; i < oChilds.length; i++) {
            if (oChilds[i] == ele)
              return i;
          }
        } else {
          return -1;
        }
      }

      var index = getIndex(evt.target.parentNode);
      ele.removeChild(evt.target.parentNode);
      RemoveValByIndex(window.imgArray, index);
      if (index < 0) {
        return;
      } else {
        ele.files.splice(index, 1);
      }
    }
  }

  ele.addEventListener('click', removeImg, false);
  function uploadImg() {
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    formData.append('files', ele.files[ele.files.length - 1]);
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          options.Success(xhr.responseText);
        } else {
          options.Failure(xhr.responseText);
        }
      }
    }

    xhr.open('POST', options.path, true);
    xhr.send(formData);

  }
  function RemoveValByIndex(arrList, index) {
    arrList.splice(index, 1);
  }
}