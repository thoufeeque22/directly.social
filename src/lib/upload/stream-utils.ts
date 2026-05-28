import fsSync from "fs";

export const writeChunk = (stream: fsSync.WriteStream, buffer: Buffer) => {
  return new Promise<void>((resolve, reject) => {
    if (stream.write(buffer)) return resolve();
    const cleanup = () => {
      stream.removeListener("drain", onDrain);
      stream.removeListener("error", onError);
    };
    function onDrain() { cleanup(); resolve(); }
    function onError(err: Error) { cleanup(); reject(err); }
    stream.on("drain", onDrain);
    stream.on("error", onError);
  });
};
