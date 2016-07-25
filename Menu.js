import React from 'react';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Profile from './Profile.js';
import MyGroup from './My_Groups.js';

var Top_menu = React.createClass({
    render: function() {
        var user_id = 1;
        return (
    <div>
        <div className="Menu">
            <div className="Top_menu">
                <ul>
                    <li><Link to="/"><img src="http://www.snucse.org/image/logo.png" /></Link></li>
                    <li><form method="POST">
                        <input type="text" name="search" placeholder="snucse검색" />
                        <input type="submit" value="검색" />
                    </form></li>
                    <li><Link to="/message" className="menulink">쪽지</Link></li>
                    <li><Link to="/others" className="menulink">기타</Link></li>
                </ul>
            </div>
            <div className="Side_menu">
                <Profile />
                <Link to="/group">전체그룹</Link>
                <ul>
                    <li className="MyGroups">내 그룹</li>
                    <MyGroup url={"http://aws.izz.kr:3000/api/v1/groups/following?current_user_id="+user_id} />
                </ul>
            </div>
        </div>
        <div className="Content">
            {this.props.children}
        </div>
    </div>
        );
    }
});

export default Top_menu;
