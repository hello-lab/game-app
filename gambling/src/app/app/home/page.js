'use client'

import { useEffect, useState } from 'react';

const HomePage = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedSport, setSelectedSport] = useState('Cricket');
    const [casinoMenu, setCasinoMenu] = useState([]);
    const [casinoLobby, setCasinoLobby] = useState([]);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    useEffect(() => {
        fetch('https://www.55sport.in/api/exchange/events/searchEventList?key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: '' })
        })
            .then(response => response.json())
            .then(data => {
                setData(data.data);
                setFilteredData(data.data.filter(item => item.sportName === 'Cricket'));
                console.log(data);
            })
            .catch(error => console.error('Error fetching data:', error));

        fetch('https://www.55sport.in/api/exchange/navigations/casinoEvents?key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: '' })
        })
            .then(response => response.json())
            .then(data => {
                setCasinoMenu(data.data.menu);
                setCasinoLobby(data.data.lobby);
                console.log(data);
            })
            .catch(error => console.error('Error fetching casino data:', error));
    }, []);

    const filterData = (sportName) => {
        setSelectedSport(sportName);
        setFilteredData(data.filter(item => item.sportName === sportName));
    };

    return (
        <div>
            <div className='highlights'>Highlights</div>
            <br></br>
            <div className='p-1 submenu'>
                <span onClick={() => filterData('Cricket')} className={selectedSport === 'Cricket' ? 'active' : ''}>Cricket</span>
                <span onClick={() => filterData('Soccer')} className={selectedSport === 'Soccer' ? 'active' : ''}>Soccer</span>
                <span onClick={() => filterData('Tennis')} className={selectedSport === 'Tennis' ? 'active' : ''}>Tennis</span>
            </div>
            <table className='bgs'>
                <tbody>
                <tr>
                    {filteredData.map((item, index) => (
                        <td key={index} className='c46'>
                            <span>{item.eventName}</span>
                            <span className='date'>{new Date(item.eventTime).toLocaleString()}</span>
                        </td>
                    ))}
                </tr>
                </tbody>
            </table>
            <div className='highlights'>Casino</div>
            <div className='tiles'>
                {casinoLobby.map((item, index) => (
                    <a key={index} href={item.link} className='tile'>
                        <span>{item.eventName}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
