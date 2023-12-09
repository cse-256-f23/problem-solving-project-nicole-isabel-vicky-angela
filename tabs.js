function step1() {
    // remove other elements
    $('#pageInformation').children().remove();

    // add text
    var howToTitle = '<div class="mainTxt TxtTitle">How To Use';
    var howTo = '<div class="mainTxt TxtBody"><ol><li>Follow each step to edit and check your permissions</li><li>Feel free to switch between tabs if needed</li></ol></div>';
    // let howToDiv = `
    // <div class="mainTxt">
    // <div class="TxtTitle">How To Use
    // <div class="TxtBody"><ol><li>Follow each step to edit and check your permissions</li><li>Feel free to switch between tabs if needed</li></ol></div>
    // </div>
    // `
    $('#pageInformation').append(howToTitle);
    $('#pageInformation').append(howTo);
}

// everything thsould save when clicking around tabs but should double check
function step2() {
    $('#pageInformation').children().remove();

    var filestructureDiv = '<div id="filestructure"></div>'
    $('#pageInformation').append(filestructureDiv);

    // make file structure
    function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    
                </button>
            </h3>
        </div>`)

       
        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                
            </button>
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
    });

    //---- some universal HTML set-up so you don't have to do it in each wrapper.html ----
    $('#filestructure').css({
        'display':'inline-block',
        'width':'49%',
        'vertical-align': 'top'
    })

    // add rules
    var instructions = 
        `<div id="instructions" style="display:inline-block;width:40%;margin-left:40px;background-color:lightgrey;">
            <h3 class="h3-pad how-to">How to Use</h3>
            <ul>
                <li>Click on "Permissions" to view and edit the permissions for a given file or folder</li>
                <li>See extended list of permissions in "More"</li>
                <li>Move popups to see instructions while editing</li>
            </ul>
            <h3 class="h3-pad">File Permission Rules</h3>
            <ul>
                <li>"Deny" permissions override "Allow"</li>
                <li>Direct permissions override inherited</li>
                <li>A file/folder may inherit permissions from its parent folder
                    <ul>
                        <li>Inheritance is turned on by default</li>
                        <li>When a permission setting is affected by inheritance, the corresponding checkbox is disabled</li>
                    </ul>
                </li>
            </ul>
            <h3 class="h3-pad">How to Identify an Error</h3>
            <ol>
                <li>Check all direct permissions for the given file/folder and user in "Permissions"</li>
                <li>If there are no issues, check the parent file/folder if inheritance is turned on</li>
                <li>Continue to check parent file/folders is needed</li>
                <li>Otherwise, the permission is denied</li>
                <li>To confirm your answer, use the "Check Permissions" panel</li>
            </ol>
        </div>`;
    $('#pageInformation').append(instructions);
    

    // add reset button
    var reset = `
        <p> To refresh the page and undo all of your changes, click the Reset button. </p>
        <button class="ui-button ui-widget ui-corner-all reset-button" id="ui-id-56" onclick="resetFunction()"> Reset Changes</button>`;
    $('#pageInformation').append(reset);
}

function step3() {
    $('#pageInformation').children().remove();

    $('#pageInformation').append('<div id="sidepanel" style=""></div>');

    let title = document.createElement("h3");
    title.textContent = "Check Permissions"
    let subtitle = document.createElement("p")
    subtitle.textContent = "Check here to see allowable permissions on a given file and user"
    $('#sidepanel').append(title).append(subtitle);

    //select user
    let new_user = define_new_user_select_field("new_user", "select user", on_user_change=function(selected_user) { 
        $('#new_permission').attr('username', selected_user);
    });
    $('#sidepanel').append(new_user);


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


    all_files_selectlist = define_single_select_list('file_select_list')

    // Make the elements which reperesent all users, and add them to the selectable
    console.log("file elements ")
    console.log(file_elements)
    all_files_selectlist.append(file_elements)  


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
        console.log('clicked!')
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