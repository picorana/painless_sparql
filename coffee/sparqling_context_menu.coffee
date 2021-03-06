class window.PainlessContextMenu

    constructor: (cy, context) ->
        @context = context
        @cy = cy
        @init()


    init: =>
        node_variable_context_menu = {
            selector: '.node-variable-full-options',
            commands: [
                {content: 'delete node', select: (ele)=> 
                    to_remove = []
                    for link in ele.data('links')
                        if link != null and link != undefined
                           to_remove.push(link)
                    for link in to_remove
                        link.delete()
                    @cy.remove(ele)
                },
                {content: 'center view',                    select: (ele) => @context.center_view(ele)}
                {content: 'add node to select statement',   select: (ele) => @context.add_to_select(ele.id())},
                {content: 'rename node',                    select: (ele) => @rename_var(ele)}
                {content: 'filter',                         select: (ele) => @context.sparql_text.add_filter(ele)}
            ] 
        }

        node_link_context_menu = {
            selector: '.node-role',
            commands: [
                {content: 'reverse', select: (ele) -> ele.data('links')[0].reverse()},
                {content: 'delete', select: (ele) -> ele.data('links')[0].delete()}
            ]
        }

        node_link_attr_context_menu = {
            selector: '.node-attribute',
            commands: [
                {content: 'delete', select: (ele)=> ele.data('links')[0].delete()}
            ]
        }

        node_attr_range_menu = {
            selector: '.attr-range',
            commands: [
                {content: 'delete', select: (ele)=> ele.data('links')[0].delete()}
                {content: 'transform into constant [object]', select: 
                    (ele)=> 
                        ele.data('color', tinycolor(ele.data('color')).desaturate(50).toString())
                        ele.data('label', 'const[o]')
                        ele.classes('node-constant-object')
                }
                {content: 'transform into constant [value]', select: 
                    (ele)=> 
                        ele.data('color', tinycolor(ele.data('color')).desaturate(50).toString())
                        ele.data('label', 'const[v]')
                        ele.classes('node-constant-value')
                }
                {content: 'filter',                         select: (ele) => @context.sparql_text.add_filter(ele)}
            ]
        }

        node_concept_menu = {
            selector: '.node-concept',
            commands: [
                {content: 'delete', select: (ele)=> ele.data('links')[0].delete()}
            ]
        }

        node_constant_value_menu = {
            selector: '.node-constant-value',
            commands: [
                {content: 'define value', select: (ele) => @rename_const(ele)}
                {content: 'delete',     select: (ele) => ele.data('links')[0].delete()}
                
            ]
        }

        node_constant_object_menu = {
            selector: '.node-constant-object',
            commands: [
                {content: 'define value', select: (ele) => @rename_const(ele)}
                {content: 'delete',     select: (ele)=> ele.data('links')[0].delete()}
            ]
        }

        @cy.cxtmenu(node_variable_context_menu)
        @cy.cxtmenu(node_link_context_menu)
        @cy.cxtmenu(node_link_attr_context_menu)
        @cy.cxtmenu(node_concept_menu)
        @cy.cxtmenu(node_constant_value_menu)
        @cy.cxtmenu(node_attr_range_menu)


    rename_const: (ele) ->
        prevlabel = ele.data('label')
        ele.data('label', '')
        container = document.createElement(div)

        div = document.createElement('div')
        div.innerHTML = ele.data('label').slice(1)
        div.style.display = 'inline-block'

        outclickhandler = (event) => 
            if event.target != div
                if div.innerHTML == ''
                    div.innerHTML = prevlabel
                ele.data('label', div.innerHTML)
                container.parentNode.removeChild(container)
                document.removeEventListener('click', outclickhandler)
                document.removeEventListener('keypress', keypresshandler)

        keypresshandler = (event) =>
            if event.key == 'Enter'
                if div.innerHTML == ''
                    div.innerHTML = prevlabel
                ele.data('label', div.innerHTML)
                container.parentNode.removeChild(container)
                document.removeEventListener('click', outclickhandler)
                document.removeEventListener('keypress', keypresshandler)

        document.addEventListener('click', outclickhandler)
        document.addEventListener('keypress', keypresshandler)

        div.setAttribute('contenteditable', true)

        container.appendChild(div)

        container.style.position = "absolute";
        container.id = "rename_div"
        container.style.top =  document.getElementById('query_canvas').getBoundingClientRect()['y'] + ele.renderedPosition('y') - ele.renderedWidth()/4 + 'px'
        container.style.left =  document.getElementById('query_canvas').getBoundingClientRect()['x'] + ele.renderedPosition('x') - ele.renderedWidth()/4 + 'px'
        container.style.backgroundColor = ele.data('color')
        container.style.fontSize = 'xx-large'
        container.style.color = '#fdf6e3'
        container.style.borderRadius = '100px'
        container.style.fontFamily = 'Courier New'
        container.style.padding = '2px'
        container.style.textAlign = 'center'

        document.body.appendChild(container)
        div.focus()


    rename_var: (ele) =>
        prevlabel = ele.data('label').slice(1)
        ele.data('label', '')
        container = document.createElement(div)

        question_mark = document.createElement('div')
        question_mark.innerHTML = '?'
        question_mark.style.display = 'inline-block'
        container.appendChild(question_mark)

        div = document.createElement('div')
        div.innerHTML = ele.data('label').slice(1)
        div.style.display = 'inline-block'

        outclickhandler = (event) => 
            if event.target != div
                if div.innerHTML == ''
                    div.innerHTML = prevlabel
                ele.data('label', '?' + div.innerHTML)
                container.parentNode.removeChild(container)
                document.removeEventListener('click', outclickhandler)
                document.removeEventListener('keypress', keypresshandler)

        keypresshandler = (event) =>
            if event.key == 'Enter'
                if div.innerHTML == ''
                    div.innerHTML = prevlabel
                ele.data('label', '?' + div.innerHTML)
                container.parentNode.removeChild(container)
                document.removeEventListener('click', outclickhandler)
                document.removeEventListener('keypress', keypresshandler)

        document.addEventListener('click', outclickhandler)
        document.addEventListener('keypress', keypresshandler)

        div.setAttribute('contenteditable', true)

        container.appendChild(div)

        container.style.position = "absolute";
        container.id = "rename_div"
        container.style.top =  document.getElementById('query_canvas').getBoundingClientRect()['y'] + ele.renderedPosition('y') - ele.renderedWidth()/4 + 'px'
        container.style.left =  document.getElementById('query_canvas').getBoundingClientRect()['x'] + ele.renderedPosition('x') - ele.renderedWidth()/4 + 'px'
        container.style.backgroundColor = ele.data('color')
        container.style.fontSize = 'xx-large'
        container.style.color = '#fdf6e3'
        container.style.borderRadius = '100px'
        container.style.fontFamily = 'Courier New'
        container.style.padding = '2px'
        container.style.textAlign = 'center'

        document.body.appendChild(container)
        div.focus()