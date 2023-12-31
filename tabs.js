function step1() {
    // remove other elements
    $('#pageInformation').children().remove();

    // add text
    var howToTitle = '<div class="mainTxt TxtTitle">How to Use';
    $('#pageInformation').append(howToTitle);
    var howTo = '<div class="mainTxt TxtBody"><ol><li>Make sure you understand the prompt before starting</li><li>Follow each step to edit and check your permissions</li><li>Feel free to switch between tabs if needed</li></ol></div>';
    $('#pageInformation').append(howTo);
}

// everything thsould save when clicking around tabs but should double check
function step2() {
    $('#pageInformation').children().remove();

    var EditPermissionTitle = '<div class="mainTxt TxtTitle">Edit File Permissions';
    $('#pageInformation').append(EditPermissionTitle);

    var filestructureDiv = '<div id="filestructure"></div>'
    $('#pageInformation').append(filestructureDiv);

    // make file structure
    function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

        if(file_obj.is_folder) {
            let folder_elem = $(`<div class='folder' id="${file_hash}_div" >
                <h3 id="${file_hash}_header" style="display:flex; align-items:center; background-color:#445E59; border: 1px solid #31081F;">
                <span class="oi oi-folder" id="${file_hash}_icon" style="padding:4px; margin-right:8px;"/> <b>${file_obj.filename}</b>
                <div style="width:100%; display:flex; justify-content:right;"> <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                </button></div>
                </h3>
            </div>`)

        
            // append children, if any:
            if( file_hash in parent_to_children) {
                let container_elem = $("<div class='folder_contents'></div>")
                folder_elem.append(container_elem)
                for(child_file of parent_to_children[file_hash]) {
                    let child_elem = make_file_element(child_file)
                    console.log('child elem')
                    console.log(child_elem)
                    container_elem.append(child_elem)
                }
            }
            return folder_elem
        }
        else {
            return $(`<div class='file'  id="${file_hash}_div" style="display:flex; align-items:center; justify-content:space-between;">
            <div>
                <span class="oi oi-file" id="${file_hash}_icon" style='margin-right:8px;'/> <b>${file_obj.filename}</b>
            </div>
            <div>
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                </button>       
            </div>
            </div>`)
        }
    }

    console.log(root_files)
    for(let root_file of root_files) {
        let file_elem = make_file_element(root_file);
        $( "#filestructure" ).append( file_elem);  
    }

    // make folder hierarchy into an accordion structure
    $('.folder').accordion({
        collapsible: true,
        heightStyle: 'content'
    })

    $('.ui-accordion-header-icon').css("padding-right","8px");

    // -- Connect File Structure lock buttons to the permission dialog --
    //Adding Permissions on Lock icon/button
    $('.permbutton').append(' Edit Permissions')

    $('.permbutton').click( function( e ) {

        // Set the path and open dialog:
        let path = e.currentTarget.getAttribute('path');
        perm_dialog.attr('filepath', path)
        perm_dialog.dialog('open')
        //open_permissions_dialog(path)
    
        // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
        e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
        // Emit a click for logging purposes:
        emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))

        $('.edit-dialog').css('border', '2px solid #31081F')
    });

    //---- some universal HTML set-up so you don't have to do it in each wrapper.html ----
    $('#filestructure').css({
        'display':'inline-block',
        'width':'49%',
        'vertical-align': 'top'
    })

    // add rules
    var instructions = 
        `
        <div id="instructions" style="display:inline-block;width:40%;margin-left:40px;background-color:lightgrey;">
            <center> <h3 class="h3-pad how-to">User Guide</h3> </center>
            <br>
            <p> Keep this guide open while you change permissions and follow steps accordingly. </p> <br>
            <p> *To refresh the page and undo all of your changes, click the <strong>Reset </strong> button </p> <br>
            <button type ="button" class="collapsible"> <div id="newArrow"> <span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-s" id="ui-id-12"> </div> </span> <strong>Add/Remove Permissions for a User</strong></button> 
            <div class="content"> 
        
            <p>
            <ol> 
                <li> Click <strong> Edit Permissions </strong> for the name of the file or folder you want to edit </li> 
                <li> Select the <strong> Users/Group </strong> whose permissions you want to edit </li>
                <ul>    
                    <li> If the user isn't listed, click <strong> Add User </strong> and add the user </li> 
                    <li> To remove a user from the file or folder, click on a User and then <strong> Remove User </strong></li>
                </ul>
                <li> From the list of Permissions, click either <strong> Allow </strong> or <strong>Deny </strong> to change permissions </li> 
                <ul> 
                    <li> If both <strong> Allow </strong> and <strong>Deny</strong> are checked, <strong>Deny</strong> overrides <strong>Allow</strong></li>
                </ul>
                <li> Click <strong>Apply</strong>. </li>
            </ol>
            </p>
            </div>

            <button type="button" class="collapsible"> <div id="newArrow"><span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-s" > </div> </span><strong> Find and Fix Errors </strong> </button>
            <div class="content"> 
            <p>
            <ol> 
                <li> Check all direct permissions for the given file/folder by clicking on the <strong>Edit Permissions</strong> button </li> 
                <li>If there are no issues, go to <strong>More</strong> and check if inheritance is turned on with the blue check mark </li> 
                <ul> 
                    <li>If it is, check the permissions in the parent file or folder. Keep checking parent files/folders as needed </li> 
                    <li> If not, continue </li> 
                </ul> 
                <li> Otherwise, the permission is denied </li> 
                <li> To check the permissions for a specific user and file go to the next tab: “Step 3: Check Permissions”</li> 
            </ol>
            </p>


        </div>`;
    $('#pageInformation').append(instructions);

    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
        content.style.display = "none";
        } else {
        content.style.display = "block";
        }
    });
    }

    document.getElementById("instructions").style.background = "wheat"; 
    

    // add reset button
    var reset = `
        <div class="resetDiv">
            <button class="ui-button ui-widget ui-corner-all reset-button" id="ui-id-56" onclick="resetFunction()"> Reset Changes</button>
        </div>`;
    $('#filestructure').append(reset);

}

function step3() {
    $('#pageInformation').children().remove();

    var CheckPermissionTitle = '<div class="mainTxt TxtTitle">Check Result Permissions';
    $('#pageInformation').append(CheckPermissionTitle);

    var ChPermHowTo = '<div class="mainTxt TxtBody" style="font-size: 20px;">Check here to see effective permissions on a selected file and user.<ol><li>Select a user.</li><li>Select a file.</li><li>A checkmark means the user is allowed to that permission. </li><li>Click "i" icon to see the reason for permission/deny.</li></ol></div>';
    $('#pageInformation').append(ChPermHowTo);

    $('#pageInformation').append('<div id="sidepanel" style=""></div>');

    //select user
    let new_user = define_new_user_select_field("new_user", "select user", on_user_change=function(selected_user) { 
        $('#new_permission').attr('username', selected_user);
    });
    $('#sidepanel').append(new_user);

    // a list of just file names
    files = Object.keys(path_to_file)
    file_elements = []//
    for (let i = 0; i < files.length; i++) {
        file_elements.push(make_user_elem('file_select', files[i]))
    }

    all_files_selectlist = define_single_select_list('file_select_list')

    // Make the elements which reperesent all users, and add them to the selectable
    console.log("file elements ")
    console.log(file_elements)
    all_files_selectlist.append(file_elements)  


    // add stuff to the dialog:
    file_select_dialog = define_new_dialog('file_select_dialog', 'Select File', {
        buttons: {
            Cancel: {
                text: "Cancel",
                id: "file_select_cancel_button",
                click: function() {
                    $( this ).dialog( "close" );
                },
            },
            OK: {
                text: "OK",
                id: "file_select_ok_button",
                click: function() {
                    // When "OK" is clicked, we want to populate some other element with the selected user name 
                    //(to pass along the selection information to whoever opened this dialog)
                    let to_populate_id = $(this).attr('to_populate') // which field do we need to populate?
                    let selected_value = all_files_selectlist.attr('selected_item') // what is the user name that was selected?
                    $(`#${to_populate_id}`).attr('selected_file', selected_value) // populate the element with the id
                    $( this ).dialog( "close" );
                }
            }
        },
        width: "500px"
    })

    file_select_dialog.append(all_files_selectlist)

    //select object
    let new_file = define_new_file_select_field("new_file", "select file", on_file_change=function(selected_file) {
        $('#new_permission').attr('filepath', selected_file);
        console.log("deinfe new file select")
        console.log($('#new_permission').attr('filepath', selected_file))
    });
    $('#sidepanel').append(new_file);

    let new_permission = define_new_effective_permissions("new_permission", true);
    $('#sidepanel').append(new_permission);

    //dialog
    let new_dialog = define_new_dialog("new dialog", "dialog");

    $('.perm_info').click(function(){
        let filepath = $('#new_permission').attr('filepath')
        let user = $('#new_permission').attr('username')
        let perm = $(this).attr('permission_name')
        let action_obj = allow_user_action(path_to_file[filepath], all_users[user], perm, true)
        new_dialog.text(get_explanation_text(action_obj))
        new_dialog.dialog('open')
    })
    }

function resetFunction() {
    //arr = [];
    location.reload(true);
    // step2() -> nothing here gets called after reload bc the page reloads so the code reloads, so 
    // we need to find another way to get the reload to occur but then click the button to stay on the same tab
}

function open_file_select_dialog(to_populate_id) {
    // TODO: reset selected user?..



    // add stuff to the dialog:
    file_select_dialog.append(all_files_selectlist)

    file_select_dialog.attr('to_populate', to_populate_id)
    file_select_dialog.dialog('open')
}

// file select
function define_new_file_select_field(id_prefix, select_button_text, on_file_change = function(selected_user){}){
    // Make the element:
    let sel_section = $(`<div id="${id_prefix}_line" class="section">
            <span id="${id_prefix}_field" class="ui-widget-content" style="width: 80%;display: inline-block;">&nbsp</span>
            <button id="${id_prefix}_button" class="ui-button ui-widget ui-corner-all">${select_button_text}</button>
        </div>`)

    // Open user select on button click:
    sel_section.find(`#${id_prefix}_button`).click(function(){
        open_file_select_dialog(`${id_prefix}_field`)
    })

    // Set up an observer to watch the attribute change and change the field
    let field_selector = sel_section.find(`#${id_prefix}_field`)
    define_attribute_observer(field_selector, 'selected_file', function(new_file){
        field_selector.text(new_file)
        // call the function for additional processing of user change:
        on_file_change(new_file)
    })

    return sel_section
}

$('#html-loc').find('*').uniqueId() 