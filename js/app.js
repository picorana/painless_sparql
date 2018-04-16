// Generated by CoffeeScript 1.12.7
(function() {
  var generate_style,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  generate_style = function() {
    return new cytoscape.stylesheet().selector('node').style({
      'background-color': 'black',
      'shape': 'rectangle'
    }).selector('.node-domain').style({
      'background-color': 'black',
      'border-color': 'black',
      'border-style': 'solid',
      'border-width': '0.5px',
      'width': 30,
      'height': 30
    }).selector('.node-range').style({
      'background-color': 'white',
      'border-color': 'black',
      'border-style': 'solid',
      'border-width': '2px',
      'width': 30,
      'height': 30
    }).selector('.node-attribute').style({
      'shape': 'diamond',
      'background-color': 'white',
      'border-style': 'solid',
      'border-color': 'black',
      'border-width': '2px',
      'content': 'data(label)',
      'width': 90,
      'color': 'white',
      'height': 60
    }).selector('.node-variable').style({
      'shape': 'ellipse',
      'background-color': function(ele) {
        return ele.data('color');
      },
      'width': function(ele) {
        return 100;
      },
      'height': function(ele) {
        return 100;
      },
      'text-valign': 'center',
      'font-size': '40',
      'font-family': "Courier New",
      'color': 'white',
      'text-outline-color': 'black',
      'text-outline-width': '2px',
      'content': 'data(label)'
    }).selector('.node-concept').style({
      'shape': 'rectangle',
      'background-color': 'white',
      'content': 'data(id)',
      'text-valign': 'center',
      'width': function(ele) {
        return ele.data('id').length * 10;
      },
      'height': '30',
      'border-color': '#000',
      'border-width': '2px',
      'border-style': 'solid'
    }).selector('node.highlight').style({
      'border-color': '#333',
      'border-opacity': '0.5',
      'border-width': '20px',
      'border-style': 'solid'
    }).selector('node:selected').style({
      'border-color': '#daa',
      'border-opacity': '0.5',
      'border-width': '20px',
      'border-style': 'solid'
    }).selector(':parent').style({
      'background-image': 'resources/background-circle.svg',
      'background-opacity': '0',
      'background-width': '100%',
      'background-height': '100%',
      'shape': 'rectangle',
      'border-color': 'white'
    });
  };

  window.SparqlText = (function() {
    var div_sparql_text, select_boxes;

    div_sparql_text = null;

    select_boxes = [];

    SparqlText.cy = null;

    function SparqlText(cy) {
      this.update = bind(this.update, this);
      this.create_dragslot = bind(this.create_dragslot, this);
      this.dragslot_drop = bind(this.dragslot_drop, this);
      this.copy_to_clipboard = bind(this.copy_to_clipboard, this);
      this.generate_plaintext_query = bind(this.generate_plaintext_query, this);
      this.remove_from_select_boxes = bind(this.remove_from_select_boxes, this);
      this.create_highlighting_box = bind(this.create_highlighting_box, this);
      div_sparql_text = document.getElementById('sparql_textbox');
      div_sparql_text.className = "unselectable";
      this.cy = cy;
      console.log(this.cy);
    }

    SparqlText.prototype.add_to_select = function(id) {
      select_boxes.push(id);
      return this.update();
    };

    SparqlText.prototype.create_tab = function() {
      var nbsp;
      nbsp = document.createElement('div');
      nbsp.innerHTML = '&nbsp;';
      return nbsp;
    };

    SparqlText.prototype.rename = function(st) {
      var i, j, node, ref;
      node = this.cy.getElementById(st.dataset.node_id);
      for (i = j = 0, ref = select_boxes.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (select_boxes[i] === st.dataset.prevname) {
          select_boxes[i] = st.innerHTML.substr(i);
        }
      }
      node.data('label', st.innerHTML.substr(1));
      return console.log(st.innerHTML);
    };

    SparqlText.prototype.create_highlighting_box = function(node) {

      /** creates a box in the sparql text that helps locate in the graph where the node is */
      var container, minicross, st;
      container = document.createElement('div');
      container.className = 'highlighting_box_container';
      st = document.createElement('div');
      st.className = "highlighting_box";
      st.id = node.id() + Math.round(Math.random() * 1000);
      st.dataset.prevname = node.id();
      st.dataset.node_id = node.id();
      st.setAttribute('draggable', true);
      st.setAttribute('contenteditable', 'true');
      st.addEventListener('dragstart', function(ev) {
        return ev.dataTransfer.setData("text", ev.target.id);
      });
      st.onkeyup = (function(_this) {
        return function() {
          return _this.rename(st);
        };
      })(this);
      st.onmouseover = function($) {
        return node.addClass("highlight");
      };
      st.onmouseout = function($) {
        return node.removeClass("highlight");
      };
      st.onclick = (function(_this) {
        return function($) {
          _this.cy.nodes().unselect();
          return node.select();
        };
      })(this);
      st.innerHTML = "?" + node.data('label');
      st.style.backgroundColor = node.data('color');
      container.append(st);
      minicross = document.createElement('div');
      minicross.innerHTML = ' x ';
      minicross.className = 'minicross';
      minicross.dataset.linkedhbox = st.id;
      minicross.dataset.node_id = st.dataset.node_id;
      minicross.style.display = 'none';
      minicross.onclick = (function(_this) {
        return function($) {
          return _this.remove_from_select_boxes(minicross.dataset.node_id);
        };
      })(this);
      container.append(minicross);
      container.onmouseover = function($) {
        return minicross.style.display = 'inline-block';
      };
      container.onmouseout = function($) {
        return minicross.style.display = 'none';
      };
      return container;
    };

    SparqlText.prototype.remove_from_select_boxes = function(node_id) {
      select_boxes = select_boxes.filter(function(elem) {
        return elem !== node_id;
      });
      return this.update();
    };

    SparqlText.prototype.generate_plaintext_query = function() {

      /** warning: VERY HACKY */
      var count, d, elem, j, k, l, len, len1, len2, ref, ref1, result;
      result = "Select ";
      if (select_boxes.length === 0) {
        result += '*';
      } else {
        for (j = 0, len = select_boxes.length; j < len; j++) {
          elem = select_boxes[j];
          result += '?' + elem + ' ';
        }
      }
      result += '\r\nwhere {';
      ref = document.getElementsByClassName('q_line');
      for (k = 0, len1 = ref.length; k < len1; k++) {
        elem = ref[k];
        result += '\r\n';
        count = 0;
        ref1 = elem.getElementsByClassName('highlighting_box');
        for (l = 0, len2 = ref1.length; l < len2; l++) {
          d = ref1[l];
          result += d.innerHTML + ' ';
          count += 1;
          if (count % 3 === 0) {
            result += ' .\r\n';
          }
        }
      }
      result += '}';
      console.log(result);
      return result;
    };

    SparqlText.prototype.copy_to_clipboard = function() {

      /** ugly hack to make you able to copy text to clipboard.
       */
      var thing, tmp_div;
      tmp_div = document.createElement('textarea');
      tmp_div.value = this.generate_plaintext_query();
      tmp_div.id = "tmp_div";
      document.body.appendChild(tmp_div);
      thing = document.getElementById('tmp_div');
      thing.select();
      document.execCommand('Copy');
      tmp_div.style.display = 'none';
      return document.body.removeChild(tmp_div);
    };

    SparqlText.prototype.dragslot_drop = function(ev, index) {
      var data, this_element_id;
      ev.preventDefault();
      data = ev.dataTransfer.getData("text");
      this_element_id = document.getElementById(data).dataset.node_id;
      select_boxes.splice(select_boxes.indexOf(this_element_id), 1);
      console.log(index);
      select_boxes.splice(index, 0, this_element_id);
      return this.update();
    };

    SparqlText.prototype.create_dragslot = function(index) {
      var nbsp;
      nbsp = document.createElement('div');
      nbsp.className = 'dragslot_select';
      nbsp.dataset.index = index;
      nbsp.addEventListener('dragover', function(ev) {
        var ds, j, len, ref, results;
        ev.preventDefault();
        ref = document.getElementsByClassName('dragslot_select');
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          ds = ref[j];
          results.push(ds.style.opacity = 1);
        }
        return results;
      });
      nbsp.addEventListener('drop', (function(_this) {
        return function(ev) {
          return _this.dragslot_drop(ev, nbsp.dataset.index);
        };
      })(this));
      nbsp.innerHTML = '&nbsp;&nbsp;';
      return nbsp;
    };

    SparqlText.prototype.update = function() {
      var count, elem, f, f_string, init_string, j, k, l, len, len1, len2, len3, len4, len5, len6, m, n, node1, node2, node3, node4, node5, o, p, q_line, ref, ref1, ref2, ref3, ref4, ref5, s_line, select_div, select_div_f;
      div_sparql_text.innerHTML = "";
      init_string = document.createElement('div');
      init_string.className = "init_string";
      s_line = document.createElement('div');
      s_line.className = "s_line";
      if (select_boxes.length === 0) {
        s_line.innerHTML = "&nbsp;*";
      } else {
        s_line.append(this.create_tab());
        count = 0;
        for (j = 0, len = select_boxes.length; j < len; j++) {
          elem = select_boxes[j];
          s_line.append(this.create_highlighting_box(this.cy.getElementById(elem)));
          s_line.append(this.create_dragslot(count));
          count += 1;
        }
      }
      select_div = document.createElement('div');
      select_div.innerHTML = "Select ";
      init_string.append(select_div);
      init_string.append(s_line);
      init_string.append(document.createElement('br'));
      select_div_f = document.createElement('div');
      select_div_f.innerHTML = " where {";
      init_string.append(select_div_f);
      div_sparql_text.append(init_string);
      q_line = document.createElement('div');
      q_line.className = "q_line";
      ref = this.cy.nodes(".node-variable");
      for (k = 0, len1 = ref.length; k < len1; k++) {
        node1 = ref[k];
        ref1 = node1.neighborhood(".node-concept");
        for (l = 0, len2 = ref1.length; l < len2; l++) {
          node2 = ref1[l];
          q_line.append(this.create_highlighting_box(node1));
          f = document.createElement("div");
          f.innerHTML = "&nbsp;rdf:type " + node2.id() + " .";
          q_line.append(f);
          q_line.append(document.createElement('br'));
        }
        ref2 = node1.neighborhood(".node-domain");
        for (m = 0, len3 = ref2.length; m < len3; m++) {
          node2 = ref2[m];
          ref3 = node2.neighborhood(".node-attribute");
          for (n = 0, len4 = ref3.length; n < len4; n++) {
            node3 = ref3[n];
            ref4 = node3.neighborhood(".node-range");
            for (o = 0, len5 = ref4.length; o < len5; o++) {
              node4 = ref4[o];
              ref5 = node4.neighborhood(".node-variable");
              for (p = 0, len6 = ref5.length; p < len6; p++) {
                node5 = ref5[p];
                q_line.append(this.create_highlighting_box(node5));
                q_line.append(this.create_tab());
                q_line.append(this.create_highlighting_box(node3));
                q_line.append(this.create_tab());
                q_line.append(this.create_highlighting_box(node1));
                f = document.createElement("div");
                f.innerHTML = " .";
                q_line.append(f);
                q_line.append(document.createElement('br'));
              }
            }
          }
        }
      }
      div_sparql_text.append(q_line);
      f_string = document.createElement('div');
      f_string.innerHTML = '}';
      return div_sparql_text.append(f_string);
    };

    return SparqlText;

  })();

  window.PainlessLink = (function() {
    var node_a, node_b, node_link;

    node_a = null;

    node_link = null;

    node_b = null;

    function PainlessLink(link_name, link_type) {
      this.link_name = link_name;
    }

    return PainlessLink;

  })();

  window.PainlessGraph = (function() {

    /** manages the graph visualization
        TODO: palette should be in constants
        TODO: hardcoded collision distance should be in constants
     */
    var cur_variable_value, palette, sparql_text, state_buffer, state_buffer_max_length;

    palette = ["b58900", "cb4b16", "dc322f", "d33682", "6c71c4", "268bd2", "2aa198", "859900"];

    cur_variable_value = 0;

    sparql_text = null;

    state_buffer = null;

    state_buffer_max_length = 20;

    function PainlessGraph() {
      this.init = bind(this.init, this);
      this.check_collisions = bind(this.check_collisions, this);
      this.add_link = bind(this.add_link, this);
      this.delete_node = bind(this.delete_node, this);
      this.cleanup_unlinked_variables = bind(this.cleanup_unlinked_variables, this);
      this.add_to_select = bind(this.add_to_select, this);
      this.center_view = bind(this.center_view, this);
      this.reshape = bind(this.reshape, this);

      /**
      TODO: sparql_text should be managed by painless_sparql.coffee
       */
      this.init();
      this.reshape();
      sparql_text = new SparqlText(this.cy);
      sparql_text.update();
    }

    PainlessGraph.prototype.reshape = function() {

      /** resets node positions in the graph view 
          TODO: it's ugly.
       */
      if (this.cy.nodes('.node-variable').length < 3) {
        return this.cy.layout({
          name: 'circle'
        }).run();
      } else {
        return this.cy.layout({
          name: 'breadthfirst',
          padding: 5,
          spacingFactor: 1,
          fit: false
        }).run();
      }
    };

    PainlessGraph.prototype.center_view = function() {

      /** 
      TODO: pan and center should actually be two different buttons!
       */
      if (this.cy.nodes(':selected').length > 0) {
        return this.cy.center(this.cy.nodes(':selected'));
      } else {
        return this.cy.fit();
      }
    };

    PainlessGraph.prototype.add_to_select = function(node_id) {
      return sparql_text.add_to_select(node_id);
    };

    PainlessGraph.prototype.copy_to_clipboard = function() {
      return sparql_text.copy_to_clipboard();
    };

    PainlessGraph.prototype.save_state = function() {
      if (state_buffer === null) {
        state_buffer = [];
      }
      if (this.cy.json() !== state_buffer[state_buffer.length - 1]) {
        state_buffer.push(this.cy.json());
      }
      if (state_buffer.length >= state_buffer_max_length) {
        return state_buffer.shift();
      }
    };

    PainlessGraph.prototype.undo = function() {
      if (state_buffer === null || state_buffer.length < 1) {
        return console.warn("no saved states");
      } else {
        this.cy.json(state_buffer[state_buffer.length - 1]);
        this.cy.style(generate_style());
        state_buffer.pop();
        return this.reshape();
      }
    };

    PainlessGraph.prototype.cleanup_unlinked_variables = function() {
      var j, len, node, ref, results;
      ref = this.cy.nodes('.node-variable');
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        node = ref[j];
        if (node.neighborhood('node').length === 0) {
          this.cy.remove(node);
          results.push(sparql_text.remove_from_select_boxes(node.id()));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    PainlessGraph.prototype.delete_node = function() {
      var j, k, l, len, len1, len2, len3, len4, m, n, node, node2, node3, node4, ref, ref1, ref2, ref3, ref4;
      this.save_state();
      ref = this.cy.nodes(':selected');
      for (j = 0, len = ref.length; j < len; j++) {
        node = ref[j];
        if (node.hasClass('node-variable')) {
          ref1 = node.neighborhood('node');
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            node2 = ref1[k];
            ref2 = node2.neighborhood('node');
            for (l = 0, len2 = ref2.length; l < len2; l++) {
              node3 = ref2[l];
              ref3 = node3.neighborhood('node');
              for (m = 0, len3 = ref3.length; m < len3; m++) {
                node4 = ref3[m];
                this.cy.remove(node4);
              }
              this.cy.remove(node3);
            }
            this.cy.remove(node2);
          }
          this.cy.remove(node);
          sparql_text.remove_from_select_boxes(node.id());
        }
        if (node.hasClass('node-attribute')) {
          ref4 = node.neighborhood('node');
          for (n = 0, len4 = ref4.length; n < len4; n++) {
            node2 = ref4[n];
            this.cy.remove(node2);
          }
          this.cy.remove(node);
        }
      }
      this.cleanup_unlinked_variables();
      return this.reshape();
    };

    PainlessGraph.prototype.merge = function(node1, node2) {

      /** merges node1 and node2, repositioning all node2's edges into node1 */
      var edge, j, len, ref;
      this.save_state();
      ref = node2.neighborhood('edge');
      for (j = 0, len = ref.length; j < len; j++) {
        edge = ref[j];
        if (edge.target().id() === node2.id()) {
          this.cy.add({
            group: 'edges',
            data: {
              source: edge.source().id(),
              target: node1.id()
            }
          });
        }
        if (edge.source().id() === node2.id()) {
          this.cy.add({
            group: 'edges',
            data: {
              source: node1.id(),
              target: edge.target().id()
            }
          });
        }
      }
      sparql_text.remove_from_select_boxes(node2.id());
      return this.cy.remove(node2);
    };

    PainlessGraph.prototype.add_link = function(link_name, link_type) {

      /** adds a new link in the graph. 
          links that are not concepts (roles and attributes) add a new variable into the graph.
          links are always added to the selected variable in the graph, if there are no selected variables,   
              two new variables are created.
      
          links can be:
          - concepts   
          - roles
          - attributes
      
          TODO: use an enum to represent link types instead of hardcoded strings
       */
      var attr_id, dom_id, par_id, parent, range_id, var_id;
      this.save_state();
      if (this.cy.nodes(":selected").length > 0 && this.cy.nodes(":selected").hasClass('node-variable')) {
        parent = this.cy.nodes(":selected");
      } else {
        par_id = "x" + cur_variable_value;
        this.cy.add({
          group: 'nodes',
          data: {
            id: par_id,
            color: '#' + palette[cur_variable_value % palette.length],
            label: par_id
          },
          classes: 'node-variable'
        });
        parent = this.cy.getElementById(par_id);
        sparql_text.add_to_select(par_id);
        cur_variable_value += 1;
      }
      range_id = parent.id() + Math.round(Math.random() * 1000);
      attr_id = link_name + Math.round(Math.random() * 1000);
      dom_id = parent.id() + range_id + "d";
      var_id = "x" + cur_variable_value;
      if (link_type === "concept") {
        this.cy.add({
          group: 'nodes',
          data: {
            id: attr_id
          },
          classes: 'node-concept'
        });
        this.cy.add({
          group: 'edges',
          data: {
            source: parent.id(),
            target: attr_id
          }
        });
      } else {
        this.cy.add({
          group: 'nodes',
          data: {
            id: range_id
          },
          classes: 'node-range'
        });
        this.cy.add({
          group: 'edges',
          data: {
            source: parent.id(),
            target: range_id
          }
        });
        this.cy.add({
          group: 'nodes',
          data: {
            id: attr_id,
            label: link_name
          },
          classes: 'node-attribute'
        });
        this.cy.add({
          group: 'edges',
          data: {
            source: range_id,
            target: attr_id
          }
        });
        this.cy.add({
          group: 'nodes',
          data: {
            id: dom_id
          },
          classes: 'node-domain'
        });
        this.cy.add({
          group: 'edges',
          data: {
            source: attr_id,
            target: dom_id
          }
        });
        this.cy.add({
          group: 'nodes',
          data: {
            id: var_id,
            color: '#' + palette[cur_variable_value % palette.length],
            label: var_id
          },
          classes: 'node-variable'
        });
        sparql_text.add_to_select(var_id);
        cur_variable_value += 1;
        this.cy.add({
          group: 'edges',
          data: {
            source: dom_id,
            target: var_id
          }
        });
      }
      sparql_text.update();
      return this.reshape();
    };

    PainlessGraph.prototype.compute_distance = function(node1, node2) {

      /** computes distance between two node positions */
      var a, b;
      a = Math.abs(node1.position('x') - node2.position('x'));
      b = Math.abs(node1.position('y') - node2.position('y'));
      return Math.sqrt(a * a + b * b);
    };

    PainlessGraph.prototype.check_collisions = function() {

      /** check if there are any collisions in all the node variables
      returns the colliding nodes if there are any.
      
      TODO: collision highlight is broken!
      TODO: remove hardcoded collision distance threshold
       */
      var j, k, len, len1, node, node2, ref, ref1;
      ref = this.cy.nodes(".node-variable");
      for (j = 0, len = ref.length; j < len; j++) {
        node = ref[j];
        ref1 = this.cy.nodes(".node-variable");
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          node2 = ref1[k];
          if (node !== node2) {
            if (this.compute_distance(node, node2) < 100) {
              node.addClass('highlight');
              node2.addClass('highlight');
              return [node, node2];
            } else {
              node.removeClass('highlight');
            }
          }
        }
      }
    };

    PainlessGraph.prototype.init = function() {
      this.cy = new cytoscape({
        container: document.getElementById("query_canvas"),
        style: generate_style(),
        wheelSensitivity: 0.5
      });
      this.cy.on('click', '.node-variable', (function(_this) {
        return function(event) {
          event.target.select();
          return _this.reshape();
        };
      })(this));
      this.cy.on('mouseup', (function(_this) {
        return function($) {
          var node_tmp_arr;
          if (_this.check_collisions() !== void 0) {
            node_tmp_arr = _this.check_collisions();
            _this.merge(node_tmp_arr[0], node_tmp_arr[1]);
          }
          return _this.reshape();
        };
      })(this));
      return this.cy.resize();
    };

    return PainlessGraph;

  })();

  window.PainlessSparql = (function() {
    var painless_graph;

    painless_graph = null;

    function PainlessSparql(graph) {
      this.onkeypress_handler = bind(this.onkeypress_handler, this);
      this.create_sidenav = bind(this.create_sidenav, this);
      this.graph = graph;
      this.cy = graph.cy;
      this.init();
    }

    PainlessSparql.prototype.init = function() {
      this.create_sidenav();
      return this.add_event_listener();
    };

    PainlessSparql.prototype.create_sidenav = function() {
      var button, down_button, menu, mid_button, nav_div, side_nav, sparql_textbox, up_button;
      side_nav = document.createElement("div");
      side_nav.id = "sidenav";
      side_nav.className = "sidenav";
      document.body.appendChild(side_nav);
      sparql_textbox = document.createElement("div");
      sparql_textbox.id = "sparql_textbox";
      sparql_textbox.innerHTML = "sparql_query_here";
      side_nav.appendChild(sparql_textbox);
      this.query_canvas = document.createElement("div");
      this.query_canvas.id = "query_canvas";
      side_nav.appendChild(this.query_canvas);
      painless_graph = new PainlessGraph(this.query_canvas);
      menu = document.createElement('div');
      menu.id = 'painless_menu';
      document.getElementById('sidenav').append(menu);
      nav_div = document.createElement('div');
      nav_div.id = 'nav_div';
      up_button = document.createElement('div');
      up_button.innerHTML = '▲';
      up_button.className = 'resize_button';
      up_button.onclick = function($) {
        query_canvas.style.height = '80%';
        sparql_textbox.style.height = '0%';
        return query_canvas.style.height = '80%';
      };
      nav_div.append(up_button);
      mid_button = document.createElement('div');
      mid_button.innerHTML = '≡';
      mid_button.className = 'resize_button';
      mid_button.onclick = function($) {
        query_canvas.style.height = '50%';
        return sparql_textbox.style.height = '30%';
      };
      nav_div.append(mid_button);
      down_button = document.createElement('div');
      down_button.innerHTML = '▼';
      down_button.className = 'resize_button';
      down_button.onclick = function($) {
        sparql_textbox.style.height = '80%';
        return query_canvas.style.height = '0%';
      };
      nav_div.append(down_button);
      menu.append(nav_div);
      button = document.createElement('button');
      button.innerHTML = 'undo';
      button.className = 'menu_button';
      button.onclick = (function(_this) {
        return function($) {
          return painless_graph.undo();
        };
      })(this);
      menu.append(button);
      button = document.createElement('button');
      button.innerHTML = 'delete node';
      button.className = 'menu_button';
      button.onclick = function() {
        return painless_graph.delete_node();
      };
      menu.append(button);
      button = document.createElement('button');
      button.innerHTML = 'reverse relationship';
      button.className = 'menu_button';
      menu.append(button);
      button = document.createElement('button');
      button.innerHTML = 'rename';
      button.className = 'menu_button';
      menu.append(button);
      button = document.createElement('button');
      button.innerHTML = 'center view';
      button.onclick = function() {
        return painless_graph.center_view();
      };
      button.className = 'menu_button';
      menu.append(button);
      button = document.createElement('button');
      button.innerHTML = 'copy to clipboard';
      button.className = 'menu_button';
      button.onclick = function() {
        return painless_graph.copy_to_clipboard();
      };
      menu.append(button);
      button = document.createElement('button');
      button.innerHTML = 'add to select';
      button.className = 'menu_button';
      button.onclick = function() {
        return painless_graph.add_to_select(painless_graph.cy.nodes(':selected').id());
      };
      menu.append(button);
      button = document.createElement('button');
      button.innerHTML = 'filter';
      button.className = 'menu_button';
      return menu.append(button);
    };

    PainlessSparql.prototype.open_nav = function() {
      return document.getElementById("sidenav").style.width = "50%";
    };

    PainlessSparql.prototype.close_nav = function() {
      return document.getElementById("sidenav").style.width = "0px";
    };

    PainlessSparql.prototype.onkeypress_handler = function(event) {
      var selected_node;
      if (event.key === "a") {
        return this.open_nav();
      } else if (event.key === "b") {
        return this.close_nav();
      } else if (event.key === "c") {
        selected_node = this.cy.nodes(":selected");
        if (selected_node.length === 0) {
          console.warn("please, select a node in the main graph");
        }
        switch (selected_node.data('type')) {
          case "role":
            return painless_graph.add_link(selected_node.data('label'), 'role');
          case "attribute":
            return painless_graph.add_link(selected_node.data('label'), 'attribute');
          case "concept":
            return painless_graph.add_link(selected_node.data('label'), 'concept');
        }
      } else if (event.key === "d") {
        return console.log(this.cy.nodes(":selected").data('type'));
      }
    };

    PainlessSparql.prototype.add_event_listener = function() {
      return document.onkeypress = this.onkeypress_handler;
    };

    return PainlessSparql;

  })();

}).call(this);
