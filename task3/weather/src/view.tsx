import React from 'react';
import { InputGroup } from '@jupyterlab/ui-components';
import { ISettingRegistry } from'@jupyterlab/settingregistry';
import { BASE_URL, EXTENSION_ID } from './const';

interface MyProps { 
    settingRegistry: ISettingRegistry;
    onDataRetrieved: (data: any) => void;
}

interface MyState {
    searchQuery: string;
    loading: boolean;
    result?: any;
    apiAccessKey?: string;
}

class WeatherView extends React.Component<MyProps, MyState> {
    constructor(props: MyProps) {
        super(props);
        this.state = {
            searchQuery: '',
            loading: false
        };
    }

    componentDidMount() {
        this.props.settingRegistry.pluginChanged.connect(this._onPluginSettingsChanged, this);
    }

    render() {
        if (!this.state.apiAccessKey)
            return this.renderApiKeyNotSet();

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

                { !this.state.loading && !!this.state.result && this.state.result.success !== false && (
                    <div className="jp-Weather-details">
                        <div className="location">{ this.state.result.location.name }, { this.state.result.location.country }</div>
                        <div className="temperature">{ this.state.result.current.temperature }&#8451;</div>
                        <div className="status">{ this.state.result.current.weather_descriptions.join(', ') }</div>
                    </div>
                )}
            </div>
        );
    }

    renderApiKeyNotSet() {
        return (
            <div className="centered">
                <h3>API Access Key Not Set</h3>
                <p>You haven't set your Weatherstack API Access Key.</p>
                <p>Go to Settings &rarr; Advanced Settings Editor &rarr; Weather Data and change the <code>apiAccessKey</code> parameter.</p>
            </div>
        )
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
        const searchQuery = window.encodeURIComponent(this.state.searchQuery);
        const url = BASE_URL.replace('{query}', searchQuery).replace('{apikey}', this.state.apiAccessKey);
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    this.setState({ loading: false }); 
                }
            })
            .then(data => {
                this.props.onDataRetrieved(data);
                this.setState({ 
                    loading: false,
                    result: data
                });
            })
            .catch(e => {
                console.log('Failed', e);
                this.setState({ loading: false }); 
            });
    }

    private async _onPluginSettingsChanged(sender: ISettingRegistry, pluginId: string) {
        const settings = await sender.load(EXTENSION_ID);
        const apiAccessKey = settings.composite['apiAccessKey'].toString();
        this.setState({ apiAccessKey });
    }
}

export default WeatherView;