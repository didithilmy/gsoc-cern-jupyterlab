import React from 'react';
import { InputGroup } from '@jupyterlab/ui-components';
import axios from 'axios';

const BASE_URL = "http://www.mocky.io/v2/5e7081573000006b007a2f42?query={query}";

interface MyProps { }

interface MyState {
    searchQuery: string;
    loading: boolean;
    result?: any;
}

class WeatherView extends React.Component<MyProps, MyState> {
    constructor(props: MyProps) {
        super(props);
        this.state = {
            searchQuery: '',
            loading: false
        };
    }

    render() {
        return (
            <div>
                <h3>Weather Information</h3>
                <p>Enter the name of your city and press enter.</p>
                <div className="jp-Weather-search-bar">
                    <InputGroup
                        className="jp-Weather-search-wrapper"
                        type="text"
                        placeholder={"Search"}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        value={this.state.searchQuery}
                        rightIcon="search"
                    />
                </div>
                { this.state.loading && (
                    <div className="jp-Weather-loading">
                        <h3>Loading...</h3>
                    </div>
                )}

                { !this.state.loading && !!this.state.result && (
                    <div className="jp-Weather-details">
                        <div className="location">{ this.state.result.location.name }, { this.state.result.location.country }</div>
                        <div className="temperature">{ this.state.result.current.temperature }&#8451;</div>
                        <div className="status">{ this.state.result.current.weather_descriptions.join(', ') }</div>
                    </div>
                )}
            </div>
        );
    }

    handleChange = (e: React.FormEvent<HTMLElement>) => {
        let target = e.target as HTMLInputElement;
        this.setState({
          searchQuery: target.value
        });
    };

    handleKeyPress = (target: React.KeyboardEvent<any>) => {
        if (target.charCode == 13) {
          this.retrieveData();
        } 
    }

    retrieveData() {
        this.setState({ loading: true });
        axios.get(BASE_URL.replace('{query}', this.state.searchQuery))
            .then(response => {
                console.log('Success', response.data);
                this.setState({ 
                    loading: false,
                    result: response.data
                });
            })
            .catch(e => {
                console.log('Failed', e);
                this.setState({ loading: false }); 
            });
    }
}

export default WeatherView;