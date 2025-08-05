// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Logging {
    // Event to be emitted when a new log is added
    event LogEntry(
        bytes32 indexed logId,
        string logType,
        bytes32 dataHash,
        uint256 timestamp
    );

    // Struct to store log details (optional, but good practice)
    struct Log {
        bytes32 logId;
        string logType;
        bytes32 dataHash;
        uint256 timestamp;
    }

    // Mapping to store logs by their ID for retrieval if needed
    mapping(bytes32 => Log) public logs;

    /**
     * @dev Adds a new log entry to the blockchain.
     * @param _logId A unique identifier for the log from the database.
     * @param _logType The type of the log (e.g., "Incident", "System").
     * @param _dataHash A SHA256 hash of the detailed log data.
     */
    function addLog(bytes32 _logId, string memory _logType, bytes32 _dataHash) public {
        // Ensure the log ID is unique to prevent overwriting
        require(logs[_logId].timestamp == 0, "Log with this ID already exists.");

        // Store the log
        logs[_logId] = Log({
            logId: _logId,
            logType: _logType,
            dataHash: _dataHash,
            timestamp: block.timestamp
        });

        // Emit an event to make the log data easily accessible off-chain
        emit LogEntry(_logId, _logType, _dataHash, block.timestamp);
    }
}