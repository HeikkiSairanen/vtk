// Released under: The MIT License

// dot: x,y, group_id, text
// group, color, name, activated
function draw_dots(dots, groups, elementId, width, height,angle) {
    this.chart = new Object;
    this.chart.width = width;
    this.chart.height = height;
    this.chart.circles = new Array;
    this.chart.groups = groups;
    this.chart.dots = dots;
    this.chart.highlights = new Array;
    this.chart.zoomfactor = 12;
    this.chart.main_selected = -1;
    this.chart.special = -1;
    this.chart.rotation = get_rotation_matrix(angle);
    rotate();
    for(x = 0; x < this.dots.length;x++) {
	this.dots[x].highlight = false;
    }

    this.paper = Raphael(document.getElementById(elementId), this.chart.width, this.chart.height);
    this.paper.rect(0,0,this.chart.width,this.chart.height);
    for(x=0; x < this.dots.length; x++) {
	var circle = this.paper.circle(convert_from_data_to_screen_x(this.dots[x].x), 
		convert_from_data_to_screen_y(this.dots[x].y), 3);
	circle.attr("fill", groups[this.dots[x].group_id].color);
	circle.attr("stroke", groups[this.dots[x].group_id].color);
	this.chart.circles.push(circle);
    }
 highlight([]);
 return this;
}

function draw_dot_graph(elementId, width, height, value_x, value_y) {
    this.chart = new Object;
    this.chart.width = width;
    this.chart.height = height;

    this.paper = Raphael(document.getElementById(elementId), this.chart.width, this.chart.height);
    this.paper.rect(0,0,this.chart.width,this.chart.height);
    
    max_value_x = get_max(value_x);
    max_value_y = get_max(value_y);


    for(c = 0; c < value_x.length; c++) {
	this.paper.circle(width*value_x[c]/max_value_x, height-(height*value_y[c]/max_value_y), 5);
	document.write(value_x[c] + ", " + value_y[c] + "<br />");
    }

}

function get_max(value) {
    var large_value = -100000;
    var largest = -1;
    for(c = 0; c < value.length; c++) {
	if(value[c] > large_value || largest == -1) {
	    largest = c;
	    large_value = value[c];
	}
    }
    return large_value;
}



function update_dots(dots) {
    this.chart.dots = dots;
    for(x=0; x < dots.length; x++) {
	this.chart.circles[x].attr('cx', convert_from_data_to_screen_x(dots[x].x));
	this.chart.circles[x].attr('cy', convert_from_data_to_screen_y(dots[x].y));
    }

}

function get_rotation_matrix(angle) {
    return [[Math.cos(angle), -Math.sin(angle)],[Math.sin(angle), Math.cos(angle)]];
}

function rotate() {
    for(c = 0; c < dots.length; c++) {
	var x = dots[c].x;
	var y = dots[c].y;
	
	this.dots[c].x = x * this.chart.rotation[0][0] + y * this.chart.rotation[0][1];
	this.dots[c].y = x * this.chart.rotation[1][0] + y * this.chart.rotation[1][1];
    }
}

function specialize_by_id(special) {
    for(x = 0; x < dots.length; x++) {
	if(this.dots[x].id == special) {
	    this.chart.special = x;
	    draw_circle(x);
	    return;
	}
    }
}

function convert_from_data_to_screen_x(x) {
    return this.chart.width / 2 + (this.chart.zoomfactor*this.chart.width/2)*x;
}

function convert_from_data_to_screen_y(y) {
    return this.chart.height / 2 - (this.chart.zoomfactor*this.chart.height/2)*y;
}

function convert_from_screen_to_data_x(x) {
 return (x-this.chart.width/2)/(this.chart.zoomfactor*this.chart.width/2);
}

function convert_from_screen_to_data_y(y) {
 return (this.chart.height/2 - y) / (this.chart.zoomfactor*this.chart.height/2);
}


function toggle_activate(group) {
    this.chart.groups[group].activated = !this.chart.groups[group].activated;
    for(x = 0; x < chart.circles.length; x++) {
	//	document.write(this.chart.dots[x].group_id);
	if(this.chart.dots[x].group_id == group) {
	    if(this.chart.groups[group].activated) {
		circle = draw_circle(x);
		circle.toFront();
	    }
	    else {
		this.chart.circles[x].attr("r", "0");
	    }
	}
    }

}

function find_nearest_circle(x,y, max) {
 var xd = convert_from_screen_to_data_x(x);
 var yd = convert_from_screen_to_data_y(y);
 var shortest = 10000000;
 var nearest_dot = -1;
 for(c = 0; c < dots.length; c++) {
     if(is_active(c) && this.dots[c].id != this.chart.special) {
	 var dot = dots[c];
	 dist_x = dot.x-xd;
	 dist_y = dot.y-yd;
	 var distsquared = dist_x*dist_x+dist_y*dist_y;
	 if(distsquared < shortest) {
	     nearest_dot = c;
	     shortest = distsquared;
	 }
     }
 }

 return nearest_dot;
}

function is_active(c) {
    return this.chart.groups[this.dots[c].group_id].activated;
}

function highlight(to_highlight) {
	if(to_highlight.length == 1) {
		this.chart.main_selected = to_highlight[0];
	}
    for(x = 0; x < this.dots.length; x++) {
	this.dots[x].highlight = false;
    }

    for(x = 0; x < to_highlight.length; x++) {
	this.dots[to_highlight[x]].highlight = true;

    }
    for(x = 0; x < this.dots.length; x++) {
	draw_circle(x);
    }    
    for(x = 0; x < to_highlight.length; x++) {
	this.chart.circles[to_highlight[x]].toFront();
    }
}

function draw_circle(x) {
    var normal_width = 3;
    if(is_active(x)) {
	if(this.chart.special == x) {
	    var pos_x = convert_from_data_to_screen_x(this.chart.dots[x].x);
	    var pos_y = convert_from_data_to_screen_y(this.chart.dots[x].y);
	    
	    this.chart.circles[x] = draw_x(pos_x,pos_y);
	}
	if(this.dots[x].highlight) {
		return this.chart.circles[x].attr("r", normal_width*3);
	}
	else {
	    return this.chart.circles[x].attr("r", dots[x].dist/2-3);
	    //	    return this.chart.circles[x].attr("r", normal_width);
	}
    }

}

function draw_x(x,y) {
    var radius = 50;
    var cross = this.paper.set();
    
    cross.push(
	       draw_line(x-radius,y-radius,x+radius,y+radius, radius/5),
	       draw_line(x-radius,y+radius,x+radius,y-radius, radius/5)
	    );
    return cross;
}


// Draw line with circles at ends
function draw_line(x1,y1,x2,y2,width) {  
    pos1 = [x1,y1];
    pos2 = [x2,y2];
    
    direction = get_direction_vector(pos1,pos2);
    rot = rotate90(direction);

    x1 = pos1[0] + width/2 * rot[0];
    y1 = pos1[1] + width/2 * rot[1];

    x2 = pos2[0] + width/2 * rot[0];
    y2 = pos2[1] + width/2 * rot[1];

    x3 = pos2[0] - width/2 * rot[0];
    y3 = pos2[1] - width/2 * rot[1];

    x4 = pos1[0] - width/2 * rot[0];
    y4 = pos1[1] - width/2 * rot[1];

    var st = paper.path("M " + x1 + " " + y1 + " L "
			+ x2 + " " + y2 + " L "
			+ x3 + " " + y3 + " L "
			+ x4 + " " + y4 + " z");
    st.attr("fill", "black");
    return st;
}

function draw_simple_line(pos1,pos2) {
    return paper.path("M" + pos1[0] + " " + pos1[1] + "L" + pos2[0] + " " + pos2[1]);
}


function rotate90(vector) {
    return [vector[1], -vector[0]];
}

function get_direction_vector(pos1,pos2) {
    dir = [pos2[0] - pos1[0], pos2[1] - pos1[1]];
    dir[0] = dir[0] / vector_length(dir);
    dir[1] = dir[1] / vector_length(dir);
    return dir;
}

function vector_length(vector) {
    return Math.sqrt(vector[1] * vector[1] + vector[0] * vector[0]);
}

function draw_time_graph(point, elementId, width, height, draw_bar) {
	chart = new Object;
	chart.width = width;
	chart.height = height;
	chart.height_chart = height - 50;
	chart.width_chart = width - 50;



	var paper = Raphael(document.getElementById(elementId, chart.width, chart.height));
	paper.rect(0,0,chart.width, chart.height);
	// Returns [min_x,min_y,max_x, max_y]
	minmax = find_min_and_max(point);
	chart.min_x = minmax[0];
	chart.min_y = minmax[1];
	chart.max_x = minmax[2];
	chart.max_y = minmax[3];
  
	var margin_y = (chart.max_y - chart.min_y) / 5;
	chart.max_y = chart.max_y + margin_y;
	
	
	// If values are also negative add a margin also below
	if(chart.min_y > 0) {
		chart.min_y = chart.min_y - margin_y;
	}


	
	if(draw_bar) {	
		for(x=0;x < point.length;x++) {
			 pos = get_pos_on_screen(point[x].date, point[x].value, chart);
			 //paper.path("M" + x_pos1 + " " + y_pos1 + "L" + x_pos2 + " " + y_pos2);
			 axispos = get_pos_on_screen(point[x].date, 0, chart);
			 if(point[x].value > 0) {		 
				var bargraph = paper.rect(pos[0]-1, pos[1], 3, axispos[1]-pos[1]);
				bargraph.attr("fill","blue");
				bargraph.attr("stroke", "blue");
				//paper.text(110,30, pos[1]-axispos[1]);  
			}		
		}
	}
	else {
		// Line chart
		for(x=0;x < point.length-1;x++) {
			pos1 = get_pos_on_screen(point[x].date, point[x].value, chart);
			pos2 = get_pos_on_screen(point[x+1].date, point[x+1].value, chart);
			paper.path("M" + pos1[0] + " " + pos1[1] + "L" + pos2[0] + " " + pos2[1]); 
		}		
	}
/*	for(x = 1; x < 10; x++) {
	 v = min_y+(x+1/2)/10*(max_y-min_y);
	 y_pos = height-height*((v-min_y)/(max_y-min_y));
	 paper.text(width-30,y_pos, Math.round(v) );

	}
	 var d = new Date();
	 diff = -(max_x - d.getTime()/1000)/60;
	 diff = Math.floor(diff);
	 paper.text(130,30, "Last updated " + diff + " minutes ago" );*/
	 
 }

 function draw_axis(chart) {
/*	 if(x_pos1 - last > 100) {
	  var d = new Date();
	  var diff = -(point[x].date - d.getTime()/1000);

	  if(diff > 24*3600) {
		desc = Math.floor(diff/(24*3600)) + " d ago";
	  }
	  else if(diff > 3600) {
		desc = Math.floor(diff/(3600)) + " h ago";
	  }
	  else if(diff > 60) {
		desc = Math.floor(diff/(60)) + " min ago";
	  }
	  paper.text(x_pos1,height-10, desc );  
	  last = x_pos1;
	 }*/
 } 
 
 function find_min_and_max(point) {
 	var min_x = point[0].date;
	var max_x = point[0].date;

	var min_y = point[0].value;
	var max_y = point[0].value;

	for(x = 1;x<point.length;x++) {
	 if(point[x].date < min_x) {
	  min_x = point[x].date;
	 }
	 if(point[x].date > max_x) {
	  max_x = point[x].date;
	 }

	 if(point[x].value < min_y) {
	  min_y = point[x].value;
	 }
	 if(point[x].value > max_y) {
	  max_y = point[x].value;
	 }
	}
	return [min_x,min_y,max_x, max_y];
}

function get_pos_on_screen(date, value, chart) {
	 x_pos = chart.width_chart*((date-chart.min_x)/(chart.max_x-chart.min_x));
	 y_pos = chart.height_chart-chart.height_chart*((value-chart.min_y)/(chart.max_y-chart.min_y));
	 	 	 
	 return [x_pos,y_pos];
}
 
