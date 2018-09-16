/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { workspace, ExtensionContext, Uri } from 'vscode';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient';

import { dirname, join } from 'path';
import { readFileSync } from 'fs';

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
    // We get activated if there is one or more elm.json file in the workspace.
    // The reason we don't activate on actual elm files is that we don't know which
    // elm.json project they belong to, since it's possible to specify crazy source-directories.

    // Start one server for each directory with an elm.json
    // and watch Elm files in those directories.
    let elmJsons = await workspace.findFiles("**/elm.json");
    for (let uri of elmJsons) {
        startClient(dirname(uri.fsPath));
    }
    // TODO: watch for addition and removal of 'elm.json' files
    // and start and stop clients for those directories.
}

let clients: Map<string, LanguageClient> = new Map();
function startClient(dir: string) {
    if (clients.has(dir)) {
        // Client was already started for this directory
        return;
    }
    // Read in elm.json to get information
    let elmJson = JSON.parse(readFileSync(`${dir}/elm.json`, 'utf8'));
    if (elmJson) {
        // Watch elm files in source and test directories for this specific project
        let sourceDirectories: string[] = ["tests "].concat(
            elmJson.type === "package"
                ? ["src", "tests"]
                : elmJson["source-directories"]
        );
        let filesWatched =
            sourceDirectories.map(d => { return { scheme: 'file', language: 'elm', pattern: `${d}/**/*` }; });

        let serverPath = "elm-language-server";

        // If the extension is launched in debug mode then the debug server options are used
        // Otherwise the run options are used
        let serverOptions: ServerOptions = {
            run: { command: serverPath, transport: TransportKind.stdio },
            debug: { command: serverPath, transport: TransportKind.stdio }
        };

        // Options to control the language client
        let clientOptions: LanguageClientOptions = {
            // Register the server for Elm documents in the directory
            documentSelector: filesWatched,
            // Notify the server about file changes to 'elm.json'
            synchronize: {
                fileEvents: workspace.createFileSystemWatcher(join(dir, 'elm.json'))
            },
            //
            workspaceFolder: {
                uri: Uri.file(dir),
                name: dir,
                index: 0
            }
        };

        // Create the language client and start the client.
        client = new LanguageClient(
            'languageServerExample',
            'Language Server Example',
            serverOptions,
            clientOptions
        );

        // Start the client. This will also launch the server
        client.start();
        clients.set(dir, client);
    }
}

export function deactivate(): Thenable<void> {
    let promises: Thenable<void>[] = [];
    for (let client of clients.values()) {
        promises.push(client.stop());
    }
    return Promise.all(promises).then(() => undefined);
}