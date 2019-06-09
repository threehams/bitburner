import { IMap } from "../types";

export const consoleHelpText: IMap<string> = {
    helpList: "Use 'help [command]' to get more information about a particular Bladeburner console command.<br><br>" +
              "automate [var] [val] [hi/low] Configure simple automation for Bladeburner tasks<br>" +
              "clear/cls                     Clear the console<br>" +
              "help [cmd]                    Display this help text, or help text for a specific command<br>" +
              "log [en/dis] [type]           Enable or disable logging for events and actions<br>" +
              "skill [action] [name]         Level or display info about your Bladeburner skills<br>" +
              "start [type] [name]           Start a Bladeburner action/task<br>"  +
              "stop                          Stops your current Bladeburner action/task<br>",
    automate: "automate [var] [val] [hi/low]<br><br>" +
              "A simple way to automate your Bladeburner actions. This console command can be used " +
              "to automatically start an action when your stamina rises above a certain threshold, and " +
              "automatically switch to another action when your stamina drops below another threshold.<br><br>" +
              "automate status - Check the current status of your automation and get a brief description of what it'll do<br>" +
              "automate en - Enable the automation feature<br>" +
              "automate dis - Disable the automation feature<br><br>" +
              "There are four properties that must be set for this automation to work properly. Here is how to set them:<br><br>" +
              "automate stamina 100 high<br>" +
              "automate contract Tracking high<br>" +
              "automate stamina 50 low<br>" +
              'automate general "Field Analysis" low<br><br>' +
              "Using the four console commands above will set the automation to perform Tracking contracts " +
              "if your stamina is 100 or higher, and then switch to Field Analysis if your stamina drops below " +
              "50. Note that when setting the action, the name of the action is CASE-SENSITIVE. It must " +
              "exactly match whatever the name is in the UI.",
    clear: "clear<br><br>Clears the console",
    cls: "cls<br><br>Clears the console",
    help: "help [command]<br><br>" +
          "Running 'help' with no arguments displays the general help text, which lists all console commands " +
          "and a brief description of what they do. A command can be specified to get more specific help text " +
          "about that particular command. For example:<br><br>" +
          "help automate<br><br>" +
          "will display specific information about using the automate console command",
    log: "log [en/dis] [type]<br><br>" +
         "Enable or disable logging. By default, the results of completing actions such as contracts/operations are logged " +
         "in the console. There are also random events that are logged in the console as well. The five categories of " +
         "things that get logged are:<br><br>" +
         "[general, contracts, ops, blackops, events]<br><br>" +
         "The logging for these categories can be enabled or disabled like so:<br><br>" +
         "log dis contracts - Disables logging that occurs when contracts are completed<br>" +
         "log en contracts - Enables logging that occurs when contracts are completed<br>" +
         "log dis events - Disables logging for Bladeburner random events<br><br>" +
         "Logging can be universally enabled/disabled using the 'all' keyword:<br><br>" +
         "log dis all<br>" +
         "log en all",
    skill: "skill [action] [name]<br><br>" +
           "Level or display information about your skills.<br><br>" +
           "To display information about all of your skills and your multipliers, use:<br><br>" +
           "skill list<br><br>" +
           "To display information about a specific skill, specify the name of the skill afterwards. " +
           "Note that the name of the skill is case-sensitive. Enter it exactly as seen in the UI. If " +
           "the name of the skill has whitespace, enclose the name of the skill in double quotation marks:<br><br>" +
           "skill list Reaper<br>" +
           'skill list "Digital Observer"<br><br>' +
           "This console command can also be used to level up skills:<br><br>" +
           "skill level [skill name]",
    start: "start [type] [name]<br><br>" +
           "Start an action. An action is specified by its type and its name. The " +
           "name is case-sensitive. It must appear exactly as it does in the UI. If " +
           "the name of the action has whitespace, enclose it in double quotation marks. " +
           "Valid action types include:<br><br>" +
           "[general, contract, op, blackop]<br><br>" +
           "Examples:<br><br>" +
           'start contract Tracking<br>' +
           'start op "Undercover Operation"<br>',
    stop: "stop<br><br>" +
          "Stop your current action and go idle",
}
