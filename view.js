// // ---- Define your dialogs  and panels here ----

// let all_file_elements = [];
// let all_buttons = document.getElementsByClassName("permbutton");

// console.log("for loop");

// for(let button of all_buttons) {
//     all_file_elements.push(button.getAttribute("path")); 
// }
// console.log("all file elements");
// console.log(all_file_elements);

// let file_elements = []
// console.log("build file_elements")
// for(let i= 0; i< all_file_elements.length; i++){
//     // make user element; if add_attributes is true, pass along usermap[uname] for attribute creation.
//     file_elem = make_user_elem('file_select', all_file_elements[i])
//     file_elements.push(file_elem)
//     console.log("all file elements[i]")
//     console.log(all_file_elements[i])
// }

// console.log("file elements")
// console.log(file_elements)

// //select user
// let new_user = define_new_user_select_field("new_user", "select user", on_user_change=function(selected_user) { 
//     $('#new_permission').attr('username', selected_user);
//     console.log("define new user select")
//     console.log($('#new_permission').attr('username', selected_user))
// });
// $('#sidepanel').append(new_user);


// file_select_dialog = define_new_dialog('file_select_dialog', 'Select File', {
//     buttons: {
//         Cancel: {
//             text: "Cancel",
//             id: "file_select_cancel_button",
//             click: function() {
//                 $( this ).dialog( "close" );
//             },
//         },
//         OK: {
//             text: "OK",
//             id: "file_select_ok_button",
//             click: function() {
//                 // When "OK" is clicked, we want to populate some other element with the selected user name 
//                 //(to pass along the selection information to whoever opened this dialog)
//                 let to_populate_id = $(this).attr('to_populate') // which field do we need to populate?
//                 let selected_value = all_files_selectlist.attr('selected_item') // what is the user name that was selected?
//                 $(`#${to_populate_id}`).attr('selected_file', selected_value) // populate the element with the id
//                 $( this ).dialog( "close" );
//             }
//         }
//     },
//     width: "500px"
// })

// function open_file_select_dialog(to_populate_id) {
//     // TODO: reset selected user?..



//     // add stuff to the dialog:
//     file_select_dialog.append(all_files_selectlist)

//     file_select_dialog.attr('to_populate', to_populate_id)
//     file_select_dialog.dialog('open')
// }

// // file select
// function define_new_file_select_field(id_prefix, select_button_text, on_file_change = function(selected_user){}){
//     // Make the element:
//     let sel_section = $(`<div id="${id_prefix}_line" class="section">
//             <span id="${id_prefix}_field" class="ui-widget-content" style="width: 80%;display: inline-block;">&nbsp</span>
//             <button id="${id_prefix}_button" class="ui-button ui-widget ui-corner-all">${select_button_text}</button>
//         </div>`)

//     // Open user select on button click:
//     sel_section.find(`#${id_prefix}_button`).click(function(){
//         open_file_select_dialog(`${id_prefix}_field`)
//     })

//     // Set up an observer to watch the attribute change and change the field
//     let field_selector = sel_section.find(`#${id_prefix}_field`)
//     define_attribute_observer(field_selector, 'selected_file', function(new_file){
//         field_selector.text(new_file)
//         // call the function for additional processing of user change:
//         on_file_change(new_file)
//     })

//     return sel_section
// }

// all_files_selectlist = define_single_select_list('file_select_list')

// // Make the elements which reperesent all users, and add them to the selectable
// console.log("file elements ")
// console.log(file_elements)
// all_files_selectlist.append(file_elements)  


// //select object
// let new_file = define_new_file_select_field("new_file", "select file", on_file_change=function(selected_file) {
//     $('#new_permission').attr('filepath', selected_file);
//     console.log("deinfe new file select")
//     console.log($('#new_permission').attr('filepath', selected_file))
// });
// $('#sidepanel').append(new_file);

// let new_permission = define_new_effective_permissions("new_permission", true);
// $('#sidepanel').append(new_permission);

// //dialog
// let new_dialog = define_new_dialog("new dialog", "dialog");

// // $('.perm_info').click(function(){
// //     console.log('clicked!')
// //     let filepath = $('#new_permission').attr('filepath')
// //     let user = $('#new_permission').attr('username')
// //     let perm = $(this).attr('permission_name')
// //     let action_obj = allow_user_action(path_to_file[filepath], all_users[user], perm, true)
// //     new_dialog.text(get_explanation_text(action_obj))
// //     new_dialog.dialog('open')
// // })


// // ---- Assign unique ids to everything that doesn't have an ID ----
// $('#html-loc').find('*').uniqueId() 