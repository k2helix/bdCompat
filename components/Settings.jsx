'use strict'

const { React, contextMenu, i18n: { Messages } } = require('powercord/webpack')
const { SwitchItem, TextInput } = require('powercord/components/settings')
const { Icons: { Overflow }, ContextMenu, Divider } = require('powercord/components')
const { shell: { openPath } } = require('electron')

const Plugin = require('./Plugin.jsx')

module.exports = class Settings extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            search: '',
        }
    }

    render () {

        this.plugins = this.__getPlugins()


        // Taken from theme-toggler <3
        return (
        <div className='powercord-entities-manage powercord-text'>
                <div className='powercord-entities-manage-header'>
                    <span>{Messages[`POWERCORD_PLUGINS_INSTALLED`]}</span>
                    <div className='buttons bdCompat-buttons'>
                        <Overflow onClick={e => this.openContextMenu(e)} onContextMenu={e => this.openContextMenu(e)} />
                    </div>
                </div>
                <SwitchItem className='bdCompat-disableWhenStopFailed' value={this.props.getSetting('disableWhenStopFailed')}
                    onChange={() => this.props.toggleSetting('disableWhenStopFailed')}>
                    Disable plugin when failed to stop
                </SwitchItem>
                <Divider/>
                <div className='powercord-entities-manage powercord-text'>
                <div className='powercord-entities-manage-search'>
                    <TextInput
                        value={this.state.search}
                        onChange={(val) => this.setState({ search: val })}
                        placeholder='What are you looking for?'
                    >
                        Search plugins
                    </TextInput>
                    </div>

                    <div className='powercord-entities-manage-items'>
                    {this.plugins.map((plugin) =>
                        <Plugin
                        plugin={plugin.plugin}
                        meta={plugin}

                        onEnable={() => window.pluginModule.enablePlugin(plugin.plugin.getName())}
                        onDisable={() => window.pluginModule.disablePlugin(plugin.plugin.getName())}
                        onDelete={() => this.__deletePlugin(plugin.plugin.getName())}
                        />
                    )}
                </div>
            </div>
        </div>
        )
    }

    __getPlugins () {
        let plugins = Object.keys(window.bdplugins)
          .map((plugin) => window.bdplugins[plugin])

        if (this.state.search !== '') {
          const search = this.state.search.toLowerCase()
    
          plugins = plugins.filter(({ plugin }) =>
            plugin.getName().toLowerCase().includes(search) ||
            plugin.getAuthor().toLowerCase().includes(search) ||
            plugin.getDescription().toLowerCase().includes(search)
          )
        }
    
        return plugins.sort((a, b) => {
          const nameA = a.plugin.getName().toLowerCase()
          const nameB = b.plugin.getName().toLowerCase()
    
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
    
          return 0
        })
      }
    
      __deletePlugin(pluginName) {
        this.props.pluginManager.delete(pluginName)
    
        this.forceUpdate()
      }

    openContextMenu(e) {
        contextMenu.openContextMenu(e, () =>
           React.createElement(ContextMenu, {
            width: '50px',
            itemGroups: [
                [
                    {
                        type: 'button',
                        name: Messages['POWERCORD_PLUGINS_OPEN_FOLDER'],
                        onClick: () => openPath(window.ContentManager.pluginsFolder)
                    },
                    {
                        type: 'button',
                        name: Messages['POWERCORD_PLUGINS_LOAD_MISSING'],
                        onClick: () => this.loadMissing()
                    }
                ]
            ]
            })
        );
    }

    loadMissing() {
      // TODO: Make this actually load missing plugins.
      console.log("aaaa::", this.__getPlugins(), this.plugins)
    }
}
